import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Info, X, ChevronDown, Star, Film, AlertTriangle, CheckCircle,
  Server, Users, Tv, Clapperboard, Share2, Bookmark, Plus,
  Copy, Send, UserPlus, Power, Pause, ShieldCheck, UserMinus, ShieldAlert,
  Minimize2, ChevronUp, Reply, Lock, ExternalLink, ArrowUp, Mail, GripHorizontal,
  MessageSquare, MessageSquareOff, Flag, Monitor, Maximize2
} from 'lucide-react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collectionGroup, getDocs, setDoc, addDoc, collection } from '../lib/firebase-stub';
import {
  BASE_URL, IMAGE_BASE_URL, IMAGE_ORIGINAL, API_KEY, LevelMovieLogo, WatchPartySVG,
  copyToClipboardFallback, formatTimeEstimate
} from '../constants';
import { LevelAvatar } from './LevelAvatar';

export function MovieModal({
  movie, mode, onClose, onSelectSimilar, t, lang, user, userPhoto, defaultUserName,
  watchlist, toggleWatchlist, showToast, handleCreateParty, partyId, partyData,
  handleSendPartyMessage, sendSystemAction, handlePartySyncAction, handleLeaveParty,
  db, APP_ID, isPartyCategory, addToHistory, isMinimized, setIsMinimized
}: any) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalMode, setModalMode] = useState(mode);

  // Player sizing on PC / Large screen (compact, balanced, cinema, full)
  const [playerSize, setPlayerSize] = useState<'compact' | 'normal' | 'large' | 'full'>(() => {
    try {
      return (localStorage.getItem('lm_player_size') as any) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const handleSetPlayerSize = (size: 'compact' | 'normal' | 'large' | 'full') => {
    setPlayerSize(size);
    try {
      localStorage.setItem('lm_player_size', size);
    } catch {}
    const labels = {
      compact: lang === 'fr' ? 'Taille : Compacte (45vh)' : 'Size: Compact (45vh)',
      normal: lang === 'fr' ? 'Taille : Équilibrée (60vh)' : 'Size: Standard (60vh)',
      large: lang === 'fr' ? 'Taille : Cinéma (75vh)' : 'Size: Cinema (75vh)',
      full: lang === 'fr' ? 'Taille : Immersion Plein écran' : 'Size: Full Immersion'
    };
    showToast(labels[size], 'info');
  };

  // Report ads / broken server state
  const [showReportAdsModal, setShowReportAdsModal] = useState(false);
  const [reportingServer, setReportingServer] = useState<string>('');
  const [reportReason, setReportReason] = useState<string>('too_many_ads');
  const [reportNote, setReportNote] = useState<string>('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [selectedServer, setSelectedServer] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('lm_now_playing') || 'null');
      if (saved && saved.id === movie.id && saved.server) return saved.server;
    } catch (e) {}
    return 'vidsrc_me';
  });
  const [pendingServer, setPendingServer] = useState('vidsrc_me');
  const [iframeLoading, setIframeLoading] = useState(true);
  const [kbOffset, setKbOffset] = useState(0);

  const isTV = movie?.first_air_date !== undefined;
  const typeStr = isTV ? 'tv' : 'movie';
  const isAddedToWatchlist = Boolean(watchlist && Array.isArray(watchlist) && movie?.id && watchlist.includes(movie.id));
  const iAmHost = !!(partyId && partyData && user?.uid === partyData.hostUid);
  const iAmMod = !!(partyId && partyData && partyData.mods?.includes(user?.uid));
  const releaseDateStr = details?.release_date || details?.first_air_date || movie?.release_date || movie?.first_air_date || null;
  const isUpcomingRelease = !!(releaseDateStr && new Date(releaseDateStr) > new Date());

  const [selectedSeason, setSelectedSeason] = useState<number>(() => {
    if (movie?.resumeSeason) return movie.resumeSeason;
    try {
      const saved = JSON.parse(localStorage.getItem('lm_now_playing') || 'null');
      if (saved && movie?.id && saved.id === movie.id && saved.mediaType === typeStr && saved.season) return saved.season;
    } catch (e) {}
    return 1;
  });
  const [selectedEpisode, setSelectedEpisode] = useState<number>(() => {
    if (movie?.resumeEpisode) return movie.resumeEpisode;
    try {
      const saved = JSON.parse(localStorage.getItem('lm_now_playing') || 'null');
      if (saved && movie?.id && saved.id === movie.id && saved.mediaType === typeStr && saved.episode) return saved.episode;
    } catch (e) {}
    return 1;
  });
  const [seasonEpisodes, setSeasonEpisodes] = useState<any[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [episodesError, setEpisodesError] = useState(false);
  const [showEpisodesPanel, setShowEpisodesPanel] = useState(false);

  useEffect(() => {
    if (!partyId) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKbOffset(offset);
    };
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onResize);
    return () => {
      vv.removeEventListener('resize', onResize);
      vv.removeEventListener('scroll', onResize);
    };
  }, [partyId]);

  const AVAILABLE_SERVERS = [
    { id: 'vidsrc_me', name: '1. GLOBAL' },
    { id: 'superembed', name: '2. MULTI' },
    { id: 'vidlink', name: '3. ALPHA' },
    { id: 'vidsrc_to', name: '4. BETA' },
    { id: 'twoembed', name: '5. THETA' }
  ];

  const getDynamicLoadingText = () => {
    const isFr = lang === 'fr' || lang === 'fr-FR';
    if (modalMode === 'trailer') {
      return isFr ? 'Chargement de la bande-annonce...' : 'Loading trailer...';
    }
    const isAnimation = movie.genre_ids?.includes(16) || details?.genres?.some((g: any) => g.id === 16 || g.name?.toLowerCase().includes('anim'));
    const isAnime = isAnimation && (movie.original_language === 'ja' || details?.original_language === 'ja' || movie.origin_country?.includes('JP'));

    if (isAnime) {
      return isFr ? 'Chargement de l’anime...' : 'Loading anime...';
    }
    if (isAnimation) {
      return isFr ? 'Chargement de l’animation...' : 'Loading animation...';
    }
    if (isTV) {
      return isFr ? `Chargement de la série (S${selectedSeason} E${selectedEpisode})...` : `Loading TV show (S${selectedSeason} E${selectedEpisode})...`;
    }
    return isFr ? 'Chargement du film...' : 'Loading movie...';
  };

  const [chatInput, setChatInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ name: string; text: string } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [syncCountdown, setSyncCountdown] = useState(0);
  const [localPauseState, setLocalPauseState] = useState({ show: false, estimatedTime: 0 });
  const [showLeavePartyConfirm, setShowLeavePartyConfirm] = useState(false);
  const [showHostLeaveWarning, setShowHostLeaveWarning] = useState(false);
  const [showModForceCloseConfirm, setShowModForceCloseConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isTitleCollapsed, setIsTitleCollapsed] = useState(false);
  const [targetShareInput, setTargetShareInput] = useState('');

  // Watch party chat hidden state for PC / Fullscreen cinema mode
  const [isChatHidden, setIsChatHidden] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [floatingNotif, setFloatingNotif] = useState<{ id: string; sender: string; text: string; photo?: string } | null>(null);
  const prevMessagesLength = useRef(partyData?.messages?.length || 0);

  useEffect(() => {
    const currentLen = partyData?.messages?.length || 0;
    if (isChatHidden && currentLen > prevMessagesLength.current) {
      const newMsgs = partyData.messages.slice(prevMessagesLength.current);
      const latestMsg = newMsgs[newMsgs.length - 1];
      const myName = defaultUserName || (lang === 'fr' ? 'Moi' : 'Me');
      if (latestMsg && latestMsg.sender !== myName) {
        setUnreadChatCount(prev => prev + newMsgs.length);
        setFloatingNotif({
          id: latestMsg.id || Date.now().toString(),
          sender: latestMsg.sender || (lang === 'fr' ? 'Participant' : 'Participant'),
          text: latestMsg.text || '',
          photo: latestMsg.photo
        });
        const timer = setTimeout(() => {
          setFloatingNotif(null);
        }, 4500);
        return () => clearTimeout(timer);
      }
    }
    prevMessagesLength.current = currentLen;
  }, [partyData?.messages, isChatHidden, defaultUserName, lang, user]);

  const toggleChatVisibility = () => {
    setIsChatHidden(prev => {
      const next = !prev;
      if (!next) {
        setUnreadChatCount(0);
        setFloatingNotif(null);
      }
      return next;
    });
  };

  const [showUserSearch, setShowUserSearch] = useState(false);
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [friendResults, setFriendResults] = useState<any[]>([]);

  const [memberMenu, setMemberMenu] = useState<any>(null);

  // PIP (Minimized Room) draggable state
  const [pipPos, setPipPos] = useState<{ x: number; y: number } | null>(null);
  const pipDragRef = useRef<{ isDragging: boolean; startX: number; startY: number; initLeft: number; initTop: number } | null>(null);
  const pipContainerRef = useRef<HTMLDivElement | null>(null);

  const handlePipPointerDown = (e: React.PointerEvent) => {
    if (!isMinimized || !pipContainerRef.current) return;
    if ((e.target as HTMLElement).closest('button')) return;

    const rect = pipContainerRef.current.getBoundingClientRect();
    pipDragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initLeft: rect.left,
      initTop: rect.top,
    };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePipPointerMove = (e: React.PointerEvent) => {
    if (!pipDragRef.current?.isDragging || !pipContainerRef.current) return;
    const dx = e.clientX - pipDragRef.current.startX;
    const dy = e.clientY - pipDragRef.current.startY;
    const pipWidth = pipContainerRef.current.offsetWidth || 280;
    const pipHeight = pipContainerRef.current.offsetHeight || 180;

    const maxLeft = Math.max(10, window.innerWidth - pipWidth - 10);
    const maxTop = Math.max(10, window.innerHeight - pipHeight - 10);

    const newLeft = Math.min(Math.max(10, pipDragRef.current.initLeft + dx), maxLeft);
    const newTop = Math.min(Math.max(10, pipDragRef.current.initTop + dy), maxTop);

    setPipPos({ x: newLeft, y: newTop });
  };

  const handlePipPointerUp = (e: React.PointerEvent) => {
    if (pipDragRef.current?.isDragging) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (_) {}
      pipDragRef.current = null;
    }
  };

  const handleSendViaGmail = (recipient?: string) => {
    const roomTitle = partyData?.roomName || partyData?.title || (movie?.title || movie?.name) || 'Salon Privé';
    const shareUrl = `${window.location.origin}/?party=${partyId}`;
    const subject = `Rejoins mon salon cinéma LevelMovie : ${roomTitle}`;
    const body = `Salut !\n\nJe t'invite à me rejoindre sur LevelMovie pour regarder "${roomTitle}" ensemble en direct avec chat synchronisé.\n\n🎬 Film : ${roomTitle}\n🔗 Lien direct : ${shareUrl}\n🔑 Code du salon : ${partyId}\n\nÀ tout de suite !`;
    const emailTarget = recipient || (targetShareInput.includes('@') ? targetShareInput.trim() : '');
    const mailtoUrl = `mailto:${encodeURIComponent(emailTarget)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/${typeStr}/${movie.id}?api_key=${API_KEY}&language=${lang}&append_to_response=credits,similar,watch/providers,videos,reviews&include_video_language=fr,en`);
        const data = await res.json();
        setDetails(data);
        setLoading(false);
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [movie, typeStr, lang]);

  useEffect(() => {
    if (!isTV) return;
    let cancelled = false;
    setLoadingEpisodes(true);
    setEpisodesError(false);

    const sortEpisodes = (list: any[]) => [...(list || [])].sort((a, b) => (a.episode_number || 0) - (b.episode_number || 0));

    fetch(`${BASE_URL}/tv/${movie.id}/season/${selectedSeason}?api_key=${API_KEY}&language=${lang}`)
      .then(r => r.json())
      .then(d => {
        if (cancelled) return;
        if (d.episodes && d.episodes.length > 0) {
          setSeasonEpisodes(sortEpisodes(d.episodes));
          setLoadingEpisodes(false);
        } else {
          return fetch(`${BASE_URL}/tv/${movie.id}/season/${selectedSeason}?api_key=${API_KEY}&language=en-US`)
            .then(r2 => r2.json())
            .then(d2 => {
              if (cancelled) return;
              setSeasonEpisodes(sortEpisodes(d2.episodes));
              setLoadingEpisodes(false);
              if (!d2.episodes || d2.episodes.length === 0) setEpisodesError(true);
            });
        }
      })
      .catch(() => {
        if (!cancelled) { setLoadingEpisodes(false); setEpisodesError(true); }
      });
    return () => { cancelled = true; };
  }, [isTV, movie.id, selectedSeason, lang]);

  useEffect(() => {
    if (partyId) return;
    if (modalMode !== 'play') return;
    try {
      localStorage.setItem('lm_now_playing', JSON.stringify({
        id: movie.id,
        mediaType: typeStr,
        server: selectedServer,
        season: isTV ? selectedSeason : null,
        episode: isTV ? selectedEpisode : null,
        ts: Date.now()
      }));
    } catch (e) {}
    try {
      const params = new URLSearchParams(window.location.search);
      params.set('watch', movie.id);
      params.set('type', typeStr);
      if (isTV) { params.set('s', selectedSeason.toString()); params.set('e', selectedEpisode.toString()); }
      else { params.delete('s'); params.delete('e'); }
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    } catch (e) {}
    if (isTV && addToHistory) {
      addToHistory(movie, selectedSeason, selectedEpisode);
    }
  }, [partyId, modalMode, selectedServer, selectedSeason, selectedEpisode, movie.id, typeStr, isTV, addToHistory]);

  useEffect(() => {
    if (!partyId || !partyData || !isTV) return;
    if (partyData.season && partyData.season !== selectedSeason) setSelectedSeason(partyData.season);
    if (partyData.episode && partyData.episode !== selectedEpisode) { setSelectedEpisode(partyData.episode); setIframeLoading(true); }
  }, [partyId, partyData?.season, partyData?.episode, isTV, selectedSeason, selectedEpisode]);

  useEffect(() => {
    if (mode === 'play' || partyId) {
      if (!disclaimerAccepted && !partyId) {
        setShowDisclaimer(true);
      } else {
        setModalMode('play');
        if (partyId) setDisclaimerAccepted(true);
      }
    } else {
      setModalMode('info');
    }
  }, [mode, partyId, disclaimerAccepted]);

  useEffect(() => {
    let timer: any;
    if (iframeLoading && (modalMode === 'play' || modalMode === 'trailer')) {
      timer = setTimeout(() => {
        setIframeLoading(false);
      }, 8000);
    }
    return () => clearTimeout(timer);
  }, [iframeLoading, modalMode, selectedServer]);

  useEffect(() => {
    if (!partyData) return;
    if (partyData.status === 'play_countdown') {
      setLocalPauseState({ show: false, estimatedTime: 0 });
      const elapsed = Math.floor((Date.now() - partyData.syncTime) / 1000);
      let remaining = 5 - elapsed;
      if (remaining > 0) {
        setSyncCountdown(remaining);
        const iv = setInterval(() => {
          remaining -= 1;
          setSyncCountdown(remaining);
          if (remaining <= 0) clearInterval(iv);
        }, 1000);
        return () => clearInterval(iv);
      } else {
        setSyncCountdown(0);
      }
    } else if (partyData.status === 'pause') {
      setSyncCountdown(0);
      setLocalPauseState({ show: true, estimatedTime: partyData.currentOffset || 0 });
    }
  }, [partyData]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [partyData?.messages]);

  useEffect(() => {
    if (!showUserSearch || friendSearchQuery.trim().length < 1) {
      setFriendResults([]);
      return;
    }
    const searchUsers = async () => {
      try {
        const q = collectionGroup(db, 'security');
        const snaps = await getDocs(q);
        const results: any[] = [];
        const queryLower = friendSearchQuery.trim().toLowerCase();

        snaps.forEach(docSnap => {
          const data = docSnap.data();
          const userNameStr = data.name || data.displayName || (data.email ? data.email.split('@')[0] : 'Inconnu');
          const userUid = data.uid || data.key;

          if (userUid && userNameStr.toLowerCase().includes(queryLower)) {
            results.push({ uid: userUid, name: userNameStr, email: data.owner || data.email, photo: null });
          }
        });

        const uniqueResults = Array.from(new Map(results.map(item => [item.uid, item])).values());
        setFriendResults(uniqueResults);
      } catch (e) {}
    };
    const delay = setTimeout(searchUsers, 500);
    return () => clearTimeout(delay);
  }, [friendSearchQuery, showUserSearch, db]);

  const handleInviteUser = async (friend: any) => {
    const inviteDataStr = localStorage.getItem(`lm_invites_${user.uid}`);
    let inviteData = inviteDataStr ? JSON.parse(inviteDataStr) : { count: 0, emails: [], weekStart: Date.now() };

    if (Date.now() - inviteData.weekStart > 7 * 24 * 60 * 60 * 1000) {
      inviteData = { count: 0, emails: [], weekStart: Date.now() };
    }

    if (inviteData.count >= 5) {
      showToast(t.inviteLimitReached, "error");
      return;
    }

    if (inviteData.emails.includes(friend.email)) {
      showToast(t.inviteAlreadySent, "error");
      return;
    }

    try {
      let emailEndpoint = 'https://levelup-ecosystem.com/api/send';
      try {
        const keyDoc = await getDoc(doc(db, "artifacts", APP_ID, "system", "keys"));
        if (keyDoc.exists() && keyDoc.data().email_endpoint) {
          emailEndpoint = keyDoc.data().email_endpoint;
        }
      } catch (_) {}

      const partyLink = `${window.location.origin}/salon?party=${partyId}`;
      await fetch(emailEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: friend.email,
          type: 'WATCH_PARTY',
          name: friend.name,
          inviterName: defaultUserName,
          partyCode: partyId,
          partyLink: partyLink,
          movieTitle: partyData?.title || partyData?.roomName || 'Watch Party'
        })
      });

      inviteData.count += 1;
      inviteData.emails.push(friend.email);
      localStorage.setItem(`lm_invites_${user.uid}`, JSON.stringify(inviteData));

      showToast(`${t.inviteSent.replace('!', '')} à ${friend.name}`, 'success');
      setShowUserSearch(false);
      setFriendSearchQuery('');
    } catch (err) {
      showToast("Erreur lors de l'envoi de l'invitation.", "error");
    }
  };

  const openMemberMenu = (member: any) => {
    if (member.uid !== user?.uid) {
      setMemberMenu(member);
    }
  };

  const handlePromoteMod = async (memberUid: string) => {
    if (user?.uid !== partyData.hostUid) return;
    const currentMods = partyData.mods || [];
    if (currentMods.length >= 4) {
      showToast(t.modLimitReached, "error");
      return;
    }
    try {
      await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'parties', partyId), {
        modInvites: arrayUnion(memberUid)
      });
      showToast("Invitation envoyée au membre.", "success");
      setMemberMenu(null);
    } catch (e) {}
  };

  const handleDemoteMod = async (memberUid: string) => {
    if (user?.uid !== partyData.hostUid) return;
    try {
      await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'parties', partyId), {
        mods: arrayRemove(memberUid)
      });
      showToast(t.filterApplied, "success");
      setMemberMenu(null);
    } catch (e) {}
  };

  const handleBanUser = async (member: any) => {
    if (!partyData) return;
    const isHost = user?.uid === partyData.hostUid;
    const isMod = partyData.mods?.includes(user?.uid);
    const targetIsHost = member.uid === partyData.hostUid;
    const targetIsMod = partyData.mods?.includes(member.uid);

    if ((isHost && !targetIsHost) || (isMod && !targetIsHost && !targetIsMod)) {
      try {
        const memberToRemove = partyData.members.find((m: any) => m.uid === member.uid);
        if (memberToRemove) {
          await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'parties', partyId), {
            members: arrayRemove(memberToRemove),
            banned: arrayUnion(member.uid),
            messages: arrayUnion({ isSystem: true, action: 'BAN', name: defaultUserName, targetName: member.name, photo: userPhoto || "", uid: user.uid, time: Date.now() })
          });
        }
        setMemberMenu(null);
      } catch (e) {}
    }
  };

  const handleMuteUser = async (memberUid: string) => {
    if (!partyData) return;
    const isHost = user?.uid === partyData.hostUid;
    const isMod = partyData.mods?.includes(user?.uid);
    const targetIsHost = memberUid === partyData.hostUid;
    const targetIsMod = partyData.mods?.includes(memberUid);

    if ((isHost && !targetIsHost) || (isMod && !targetIsHost && !targetIsMod)) {
      try {
        await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'parties', partyId), {
          muted: arrayUnion({ uid: memberUid, by: defaultUserName })
        });
        setMemberMenu(null);
        showToast(t.filterApplied, "info");
      } catch (e) {}
    }
  };

  const handleUnmuteUser = async (member: any) => {
    if (!partyData) return;
    const isHost = user?.uid === partyData.hostUid;
    const isMod = partyData.mods?.includes(user?.uid);

    if (isHost || isMod) {
      try {
        const muteObj = partyData.muted?.find((m: any) => m.uid === member.uid);
        if (muteObj) {
          await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'parties', partyId), {
            muted: arrayRemove(muteObj)
          });
        }
        setMemberMenu(null);
        showToast(t.filterApplied, "info");
      } catch (e) {}
    }
  };

  const confirmLeave = () => {
    if (user?.uid === partyData?.hostUid && partyData.members.length > 1 && (!partyData.mods || partyData.mods.length === 0)) {
      setShowHostLeaveWarning(true);
      setShowLeavePartyConfirm(false);
    } else {
      handleLeaveParty();
      setShowLeavePartyConfirm(false);
      setShowHostLeaveWarning(false);
    }
  };

  const handleShare = () => {
    const url = `https://www.themoviedb.org/${typeStr}/${movie.id}`;
    const text = `${t.share} "${movie.title || movie.name}" !`;
    if (navigator.share) {
      navigator.share({ title: 'LevelMovie', text: text, url: url }).catch(() => {});
    } else {
      copyToClipboardFallback(`${text} ${url}`);
      showToast(t.linkCopied, 'success');
    }
  };

  const getTrailerKey = () => {
    if (!details?.videos?.results) return '';
    const frTrailer = details.videos.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube' && v.iso_639_1 === 'fr');
    if (frTrailer) return frTrailer.key;
    const anyTrailer = details.videos.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
    return anyTrailer ? anyTrailer.key : (details.videos.results.find((v: any) => v.site === 'YouTube')?.key || '');
  };

  const [reminderSet, setReminderSet] = useState(false);

  useEffect(() => {
    if (!isUpcomingRelease || !user) { setReminderSet(false); return; }
    getDoc(doc(db, 'artifacts', 'levelup-ecosystem', 'public', 'data', 'release_reminders', `${movie.id}_${user.uid}`))
      .then(snap => setReminderSet(snap.exists()))
      .catch(() => setReminderSet(false));
  }, [movie.id, user, isUpcomingRelease, db]);

  const handleSetReleaseReminder = async (movieObj: any, detailsObj: any) => {
    if (!user) { showToast(t.loginRequiredDesc, 'error'); return; }
    try {
      await setDoc(doc(db, 'artifacts', 'levelup-ecosystem', 'public', 'data', 'release_reminders', `${movieObj.id}_${user.uid}`), {
        movieId: movieObj.id,
        mediaType: typeStr,
        title: movieObj.title || movieObj.name,
        releaseDate: releaseDateStr,
        uid: user.uid,
        app: 'levelmovie',
        notified: false,
        createdAt: new Date().toISOString()
      });
      setReminderSet(true);
      showToast(t.reminderConfirmed, 'success');
    } catch (e) { showToast(t.reminderError, 'error'); }
  };

  const openReportModal = (serverId?: string) => {
    setReportingServer(serverId || selectedServer);
    setReportReason('too_many_ads');
    setReportNote('');
    setShowReportAdsModal(true);
  };

  const submitServerReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingServer) return;
    setIsSubmittingReport(true);
    const serverObj = AVAILABLE_SERVERS.find(s => s.id === reportingServer);
    const serverName = serverObj ? serverObj.name : reportingServer;
    const reportPayload = {
      serverId: reportingServer,
      serverName,
      reason: reportReason,
      note: reportNote.trim(),
      mediaId: movie?.id || null,
      mediaTitle: movie?.title || movie?.name || '',
      mediaType: typeStr,
      season: isTV ? selectedSeason : null,
      episode: isTV ? selectedEpisode : null,
      userUid: user?.uid || 'anonymous',
      userName: defaultUserName || 'Utilisateur',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Post to backend reporting endpoint
      fetch('/api/report-server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportPayload)
      }).catch(() => {});

      // 2. Save locally for instant persistence
      try {
        const localReports = JSON.parse(localStorage.getItem('levelmovie_server_reports') || '[]');
        localReports.unshift(reportPayload);
        localStorage.setItem('levelmovie_server_reports', JSON.stringify(localReports.slice(0, 50)));
      } catch (_) {}

      // 3. Try Firestore if available and authorized, catching permissions errors silently
      if (db && APP_ID) {
        try {
          await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'server_reports'), reportPayload);
        } catch (_) {
          // Fallback gracefully without console error spam
        }
      }

      setShowReportAdsModal(false);
      showToast(
        lang === 'fr' 
          ? `Signalement envoyé pour le serveur ${serverName}. Merci de votre aide !` 
          : `Report sent for ${serverName}. Thank you for helping keep servers clean!`,
        'success'
      );
    } catch (_) {
      setShowReportAdsModal(false);
      showToast(
        lang === 'fr' ? 'Signalement pris en compte !' : 'Report recorded!',
        'success'
      );
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handlePlayRequest = (serverId: string) => {
    if (!disclaimerAccepted && !partyId) {
      setPendingServer(serverId);
      setShowDisclaimer(true);
    } else {
      if (selectedServer !== serverId) setIframeLoading(true);
      setSelectedServer(serverId);
      setModalMode('play');
    }
  };

  const handlePlayEpisode = (season: number, episode: number) => {
    if (partyId) {
      if (!(iAmHost || iAmMod)) return;
      setIframeLoading(true);
      setShowEpisodesPanel(false);
      setSelectedSeason(season);
      setSelectedEpisode(episode);
      updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'parties', partyId), {
        season: season,
        episode: episode,
        messages: arrayUnion({ isSystem: true, action: 'EPISODE', name: defaultUserName, photo: userPhoto || "", season, episode, uid: user.uid, time: Date.now() })
      }).catch(() => {});
      return;
    }
    if (season !== selectedSeason) setSelectedEpisode(episode);
    setSelectedSeason(season);
    setSelectedEpisode(episode);
    setIframeLoading(true);
    setShowEpisodesPanel(false);
    if (!disclaimerAccepted) {
      setPendingServer(selectedServer);
      setShowDisclaimer(true);
    } else {
      setModalMode('play');
    }
  };

  const getFormatRuntime = () => {
    if (!details) return '';
    if (details.runtime) {
      const h = Math.floor(details.runtime / 60);
      const m = details.runtime % 60;
      return `${h}h ${m}m`;
    } else if (details.episode_run_time && details.episode_run_time.length > 0) {
      return `${details.episode_run_time[0]} min/ep`;
    }
    return '';
  };

  const getDirector = () => {
    if (!details) return t.notSpecified;
    let directors: string[] = [];
    if (details.credits && details.credits.crew) {
      directors = details.credits.crew.filter((c: any) => c.job === 'Director').map((c: any) => c.name);
    }
    if (directors.length === 0 && details.created_by) {
      directors = details.created_by.map((c: any) => c.name);
    }
    return directors.length > 0 ? directors.join(', ') : t.notSpecified;
  };

  const getWatchProviders = () => {
    if (!details) return null;
    const providersObj = details['watch/providers'] || details.watch_providers;
    if (!providersObj || !providersObj.results) return null;
    const results = providersObj.results;
    const isFrench = lang === 'fr' || lang === 'fr-FR';
    const country = isFrench ? 'FR' : 'US';
    return results[country] || results['FR'] || results['US'] || results['CA'] || results['GB'] || Object.values(results)[0] || null;
  };

  let iframeSrc = '';
  if (selectedServer === 'vidsrc_me') {
    iframeSrc = isTV ? `https://vidsrc.me/embed/tv?tmdb=${movie.id}&season=${selectedSeason}&episode=${selectedEpisode}` : `https://vidsrc.me/embed/movie?tmdb=${movie.id}`;
  } else if (selectedServer === 'superembed') {
    iframeSrc = isTV ? `https://multiembed.mov/?video_id=${movie.id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode}` : `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`;
  } else if (selectedServer === 'vidlink') {
    iframeSrc = isTV ? `https://vidlink.pro/tv/${movie.id}/${selectedSeason}/${selectedEpisode}` : `https://vidlink.pro/movie/${movie.id}`;
  } else if (selectedServer === 'vidsrc_to') {
    iframeSrc = isTV ? `https://vidsrc.to/embed/tv/${movie.id}/${selectedSeason}/${selectedEpisode}` : `https://vidsrc.to/embed/movie/${movie.id}`;
  } else if (selectedServer === 'twoembed') {
    iframeSrc = isTV ? `https://2embed.cc/embedtv/${movie.id}&s=${selectedSeason}&e=${selectedEpisode}` : `https://2embed.cc/embed/${movie.id}`;
  } else if (selectedServer === 'archive') {
    const title = movie.title || movie.name;
    const suffix = lang === 'fr-FR' ? ' film complet' : ' full movie';
    const q = encodeURIComponent(title + suffix);
    iframeSrc = `https://www.youtube.com/embed?listType=search&list=${q}&autoplay=1`;
  }

  const renderIframe = () => {
    if (modalMode === 'info') {
      const tKey = getTrailerKey();
      if (movie.backdrop_path) {
        return (
          <div className="absolute inset-0 w-full h-full group cursor-pointer bg-black" onClick={() => {
            if (tKey) {
              setIframeLoading(true);
              setModalMode('trailer');
            } else showToast(t.notFound, 'error');
          }}>
            <img src={`${IMAGE_ORIGINAL}${movie.backdrop_path}`} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity duration-500" alt="" draggable="false" />
            {tKey && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/60 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#a855f7]/90 group-hover:border-[#a855f7] transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                  <Play className="w-8 h-8 md:w-10 md:h-10 fill-white text-white ml-1 md:ml-1.5 opacity-80 group-hover:opacity-100" />
                </div>
                <span className="mt-4 text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{t.trailer}</span>
              </div>
            )}
          </div>
        );
      }
      return <div className="absolute inset-0 bg-black flex items-center justify-center text-white/30"><Film className="w-16 h-16" /></div>;
    }

    if (modalMode === 'trailer') {
      const tKey = getTrailerKey();
      if (tKey) {
        return (
          <>
            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-0">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#a855f7]/25 blur-xl rounded-full animate-pulse scale-150" />
                  <LevelMovieLogo className="w-10 h-10 text-[#c084fc] relative z-10 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.85)]" />
                </div>
              </div>
            )}
            <iframe key={`trailer-${tKey}`} className={`absolute inset-0 w-full h-full bg-black z-10 transition-opacity duration-500 ${iframeLoading ? 'opacity-0' : 'opacity-100'}`} src={`https://www.youtube-nocookie.com/embed/${tKey}?autoplay=1&controls=1&modestbranding=1&rel=0&playsinline=1&showinfo=0&fs=1`} onLoad={() => setIframeLoading(false)} allow="autoplay; encrypted-media; picture-in-picture" frameBorder="0" allowFullScreen></iframe>
          </>
        );
      }
      return <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white/50"><Clapperboard className="w-12 h-12 mb-2 opacity-50"/><span>{t.notFound}</span></div>;
    }

    return (
      <>
        {iframeLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-0">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#a855f7]/25 blur-xl rounded-full animate-pulse scale-150" />
              <LevelMovieLogo className="w-10 h-10 text-[#c084fc] relative z-10 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.85)]" />
            </div>
          </div>
        )}
        <iframe key={iframeSrc} className={`absolute inset-0 w-full h-full bg-transparent z-10 transition-opacity duration-500 ${iframeLoading ? 'opacity-0' : 'opacity-100'}`} src={iframeSrc} onLoad={() => setIframeLoading(false)} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </>
    );
  };

  // THEATER MODE (WATCH PARTY)
  if (partyId && partyData) {
    if (!partyData.title) {
      return (
        <div className="fixed inset-0 z-[8000] bg-[#060608] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a855f7] mb-4"></div>
          <span className="text-[#a855f7] font-black uppercase tracking-widest text-xs animate-pulse">Connexion au salon...</span>
        </div>
      );
    }

    return (
      <div
        ref={pipContainerRef}
        onPointerDown={handlePipPointerDown}
        onPointerMove={handlePipPointerMove}
        onPointerUp={handlePipPointerUp}
        onPointerCancel={handlePipPointerUp}
        style={
          isMinimized
            ? {
                position: 'fixed',
                left: pipPos ? `${pipPos.x}px` : undefined,
                top: pipPos ? `${pipPos.y}px` : undefined,
                touchAction: 'none',
              }
            : { paddingTop: 'env(safe-area-inset-top, 0px)' }
        }
        className={
          isMinimized
            ? `${pipPos ? '' : 'bottom-24 md:bottom-6 right-4 md:right-6'} fixed z-[8000] w-[240px] md:w-[320px] rounded-2xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.85)] border border-[#a855f7]/40 bg-[#0c0c12] animate-in fade-in zoom-in duration-200 select-none cursor-grab active:cursor-grabbing`
            : "fixed inset-0 z-[8000] bg-[#060608] flex flex-col lg:flex-row w-full h-[100dvh] overflow-hidden"
        }
      >

        {/* Modal de Modération */}
        {memberMenu && (
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setMemberMenu(null)}>
            <div className="bg-[#151520] border border-[#a855f7]/30 rounded-2xl p-5 max-w-xs w-full text-center shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
              <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4">Gérer {memberMenu.name}</h3>
              <div className="flex flex-col gap-2">
                {partyData.muted?.some((m: any) => m.uid === memberMenu.uid) ? (
                  <button onClick={() => handleUnmuteUser(memberMenu)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase transition-colors outline-none cursor-pointer">{t.unmuteUser}</button>
                ) : (
                  <button onClick={() => handleMuteUser(memberMenu.uid)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase transition-colors outline-none cursor-pointer">{t.muteUser}</button>
                )}

                {(() => {
                  const targetIsHost = memberMenu.uid === partyData.hostUid;
                  const targetIsMod = partyData.mods?.includes(memberMenu.uid);
                  const canBan = (iAmHost && !targetIsHost) || (iAmMod && !targetIsHost && !targetIsMod);
                  const canPromote = iAmHost && !targetIsHost && !targetIsMod;
                  const canDemote = iAmHost && targetIsMod;

                  return (
                    <>
                      {canPromote && <button onClick={() => handlePromoteMod(memberMenu.uid)} className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-[10px] font-bold uppercase transition-colors outline-none cursor-pointer">{t.promoteMod}</button>}
                      {canDemote && <button onClick={() => handleDemoteMod(memberMenu.uid)} className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-[10px] font-bold uppercase transition-colors outline-none cursor-pointer">{t.demoteMod}</button>}
                      {canBan && <button onClick={() => handleBanUser(memberMenu)} className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl text-[10px] font-bold uppercase transition-colors outline-none cursor-pointer">{t.banUser}</button>}
                    </>
                  );
                })()}

                <button onClick={() => setMemberMenu(null)} className="w-full py-3 mt-2 text-white/50 hover:text-white text-[10px] font-bold uppercase transition-colors outline-none cursor-pointer">{t.menuCancel}</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Quitter Salon */}
        {showLeavePartyConfirm && (
          <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0a0a0f] border border-red-500/30 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-in zoom-in duration-300">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">{iAmHost ? t.leavePartyTitle : t.quitPartyTitle}</h3>
              <p className="text-white/60 text-xs mb-6">{iAmHost ? t.leavePartyDesc : t.quitPartyDesc}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLeavePartyConfirm(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-[10px] font-bold uppercase transition-colors outline-none cursor-pointer">{t.cancel}</button>
                <button onClick={confirmLeave} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-colors outline-none cursor-pointer">{iAmHost ? t.leaveBtn : t.quitBtn}</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal fermeture forcée par un modérateur */}
        {showModForceCloseConfirm && (
          <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0a0a0f] border border-red-500/30 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-in zoom-in duration-300">
              <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">{t.modForceCloseTitle}</h3>
              <p className="text-white/60 text-xs mb-6 leading-relaxed">{t.modForceCloseDesc}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowModForceCloseConfirm(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-[10px] font-bold uppercase transition-colors outline-none cursor-pointer">{t.cancel}</button>
                <button onClick={() => { setShowModForceCloseConfirm(false); handleLeaveParty(true); }} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-colors outline-none cursor-pointer">{t.modForceCloseConfirm}</button>
              </div>
            </div>
          </div>
        )}

        {showHostLeaveWarning && (
          <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0a0a0f] border border-[#a855f7]/30 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-in zoom-in duration-300">
              <ShieldAlert className="w-12 h-12 text-[#a855f7] mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">Attention</h3>
              <p className="text-white/60 text-xs mb-6 leading-relaxed">{t.leaveNoModWarning}</p>
              <div className="flex flex-col gap-2">
                <button onClick={() => setShowHostLeaveWarning(false)} className="w-full py-3 bg-[#a855f7] text-white rounded-xl text-[10px] font-black uppercase transition-colors outline-none cursor-pointer">{t.assignModBtn}</button>
                <button onClick={() => { setShowHostLeaveWarning(false); handleLeaveParty(true); }} className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-bold uppercase transition-colors outline-none cursor-pointer">{t.closeAnyway}</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Partage Professionnel (Lien, Code, ID/Gmail) */}
        {showShareModal && (
          <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
            <div className="bg-[#0c0c14] border border-[#a855f7]/40 rounded-3xl p-5 md:p-7 max-w-md w-full shadow-[0_0_60px_rgba(168,85,247,0.25)] animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto no-scrollbar" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-[#c084fc]" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-white uppercase tracking-wider">Partager le Salon</h3>
                    <p className="text-white/50 text-[11px]">Invite tes amis à regarder ensemble en direct</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="text-white/40 hover:text-white bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. LIEN DU SALON */}
              <div className="mb-5 bg-white/5 p-4 rounded-2xl border border-white/10">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] block mb-2">
                  1. Lien direct de la salle
                </label>
                <div className="bg-black/60 border border-white/10 px-3 py-2.5 rounded-xl mb-3 overflow-hidden">
                  <span className="text-white/80 font-mono text-[11px] break-all select-all">
                    {`${window.location.origin}/?party=${partyId}`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/?party=${partyId}`;
                      copyToClipboardFallback(shareUrl);
                      showToast(t.linkCopied || 'Lien copié dans le presse-papier !', 'success');
                    }}
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copier le lien
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/?party=${partyId}`;
                      if (navigator.share) {
                        navigator.share({
                          title: `Rejoins le salon cinéma : ${partyData.roomName || partyData.title}`,
                          text: `Rejoins-moi sur LevelMovie pour regarder ensemble en streaming synchronisé !`,
                          url: shareUrl
                        }).catch(() => {});
                      } else {
                        copyToClipboardFallback(shareUrl);
                        showToast(t.linkCopied || 'Lien copié !', 'success');
                      }
                    }}
                    className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Partager
                  </button>
                </div>
              </div>

              {/* 2. CODE D'ACCÈS DU SALON */}
              <div className="mb-5 bg-white/5 p-4 rounded-2xl border border-white/10">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] block mb-2">
                  2. Code de la salle (rejoindre direct dans l'app)
                </label>
                <div className="flex items-center justify-between bg-black/60 border border-white/10 px-4 py-3 rounded-xl">
                  <span className="text-[#a855f7] font-mono font-black tracking-widest text-lg md:text-xl select-all">
                    {partyId}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      copyToClipboardFallback(partyId);
                      showToast('Code de salon copié !', 'success');
                    }}
                    className="py-1.5 px-3 bg-[#a855f7]/20 hover:bg-[#a855f7]/40 text-[#c084fc] border border-[#a855f7]/30 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copier le code
                  </button>
                </div>
              </div>

              {/* 3. PARTAGER À UN USER VIA ID OU GMAIL */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] block mb-2">
                  3. Partager à un utilisateur (ID ou Gmail)
                </label>
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={targetShareInput}
                      onChange={(e) => {
                        setTargetShareInput(e.target.value);
                        setFriendSearchQuery(e.target.value);
                        setShowUserSearch(true);
                      }}
                      placeholder="Entrer un ID ou email (ex: user@gmail.com)..."
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#a855f7] transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSendViaGmail()}
                    className="bg-gradient-to-r from-red-600/80 to-pink-600/80 hover:from-red-600 hover:to-pink-600 text-white px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                    title="Envoyer une invitation par Gmail"
                  >
                    <Mail className="w-3.5 h-3.5" /> Gmail
                  </button>
                </div>

                {friendResults.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5 max-h-32 overflow-y-auto no-scrollbar bg-black/40 p-2 rounded-xl border border-white/5">
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider px-1">Utilisateurs trouvés :</span>
                    {friendResults.map((friend: any) => (
                      <div key={friend.uid} className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-[#151520] flex items-center justify-center font-black text-[#a855f7] text-[10px] shrink-0 border border-[#a855f7]/30">
                            {friend.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="text-xs text-white font-bold truncate">{friend.name}</span>
                        </div>
                        {friend.uid !== user?.uid && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleSendViaGmail(friend.email)}
                              className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-2 py-1 rounded text-[9px] font-bold uppercase transition-colors cursor-pointer"
                              title="Inviter par Gmail"
                            >
                              Gmail
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInviteUser(friend)}
                              className="bg-[#a855f7] hover:bg-purple-600 text-white px-2.5 py-1 rounded text-[9px] font-black uppercase transition-colors cursor-pointer"
                            >
                              Inviter
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Signalement de Publicités sur un Serveur */}
        {showReportAdsModal && (
          <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowReportAdsModal(false)}>
            <div className="bg-[#0c0c14] border border-[#a855f7]/40 rounded-3xl p-5 md:p-7 max-w-md w-full shadow-[0_0_60px_rgba(168,85,247,0.25)] animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400">
                    <Flag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-white uppercase tracking-wider">
                      {lang === 'fr' ? 'Signaler des Publicités' : 'Report Server Ads'}
                    </h3>
                    <p className="text-white/50 text-[11px]">
                      {lang === 'fr' ? 'Aidez-nous à filtrer les serveurs abusifs' : 'Help us filter out intrusive ad servers'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReportAdsModal(false)}
                  className="text-white/40 hover:text-white bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={submitServerReport} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] block mb-2">
                    {lang === 'fr' ? 'Serveur concerné' : 'Target Server'}
                  </label>
                  <select
                    value={reportingServer}
                    onChange={(e) => setReportingServer(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none focus:border-[#a855f7] transition-colors cursor-pointer"
                  >
                    {AVAILABLE_SERVERS.map(srv => (
                      <option key={srv.id} value={srv.id} className="bg-[#151520] text-white">
                        {srv.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] block mb-2">
                    {lang === 'fr' ? 'Type de problème constaté' : 'Observed Issue'}
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'too_many_ads', label: lang === 'fr' ? 'Trop de fenêtres pop-up / pubs invasives' : 'Excessive pop-ups / intrusive ads' },
                      { id: 'redirect_blocks', label: lang === 'fr' ? 'Redirections qui bloquent la lecture vidéo' : 'Redirects blocking video playback' },
                      { id: 'inappropriate_ads', label: lang === 'fr' ? 'Contenu publicitaire inapproprié ou suspect' : 'Inappropriate or suspicious ad content' },
                      { id: 'broken_stream', label: lang === 'fr' ? 'Flux vidéo indisponible ou bloqué' : 'Stream broken or unavailable' },
                    ].map(reason => (
                      <label
                        key={reason.id}
                        onClick={() => setReportReason(reason.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          reportReason === reason.id
                            ? 'bg-[#a855f7]/15 border-[#a855f7] text-white font-bold'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <input
                          type="radio"
                          name="reportReason"
                          checked={reportReason === reason.id}
                          onChange={() => setReportReason(reason.id)}
                          className="accent-[#a855f7]"
                        />
                        <span>{reason.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block mb-1.5">
                    {lang === 'fr' ? 'Précisions supplémentaires (optionnel)' : 'Additional details (optional)'}
                  </label>
                  <textarea
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    placeholder={lang === 'fr' ? 'Ex: Redirige vers un faux site dès qu’on clique sur play...' : 'Ex: Opens redirects on play click...'}
                    rows={2}
                    className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-xs text-white outline-none focus:border-[#a855f7] transition-colors placeholder:text-white/30 resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowReportAdsModal(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    {t.cancel || 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReport}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{isSubmittingReport ? 'Envoi...' : (lang === 'fr' ? 'Envoyer le signalement' : 'Submit report')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Recherche d'amis */}
        {showUserSearch && (
          <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowUserSearch(false)}>
            <div className="bg-[#0a0a0f] border border-[#a855f7]/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-in zoom-in duration-300 flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <UserPlus className="w-6 h-6 text-[#a855f7]" /> {t.searchFriendModalTitle}
                </h3>
                <button onClick={() => setShowUserSearch(false)} className="text-white/40 hover:text-white outline-none bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors shadow-sm active:scale-95 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>

              <div className="relative mb-5 shrink-0">
                <input 
                  type="text" 
                  value={friendSearchQuery}
                  onChange={(e) => setFriendSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#a855f7] shadow-inner transition-colors"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto no-scrollbar flex-1 flex flex-col gap-2 min-h-[200px] bg-white/5 rounded-2xl p-2 border border-white/5 shadow-inner">
                {friendResults.map((friend: any) => (
                  <div key={friend.uid} className="flex items-center justify-between bg-black/40 hover:bg-black/60 border border-white/5 p-3 rounded-xl transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-[#151520] flex items-center justify-center border border-[#a855f7]/30 shadow-sm shrink-0 font-black text-[#a855f7] text-sm">
                        {friend.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-white truncate">
                          {friend.name} {friend.uid === user?.uid && <span className="text-[#a855f7] text-[10px] ml-1 uppercase tracking-widest">(Vous)</span>}
                        </span>
                      </div>
                    </div>
                    {friend.uid !== user?.uid && (
                      <button onClick={() => handleInviteUser(friend)} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase outline-none shadow-md transition-all active:scale-95 shrink-0 ml-2 cursor-pointer">
                        Envoyer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Colonne Gauche: Vidéo + Contrôles */}
        <div className={
          isMinimized 
            ? "w-full flex flex-col relative bg-black" 
            : isChatHidden
              ? "w-full flex-1 flex flex-col shrink-0 relative z-[60] bg-black shadow-2xl h-full min-h-[100dvh]"
              : "w-full lg:flex-1 flex flex-col shrink-0 lg:shrink relative z-[60] bg-black shadow-2xl h-auto max-h-[60vh] lg:max-h-full"
        }>
          <div className={isMinimized ? "w-full aspect-video bg-black relative flex items-center justify-center group" : isChatHidden ? "w-full flex-1 bg-black relative border-b border-white/5 z-40 flex items-center justify-center group" : "w-full aspect-video lg:aspect-auto lg:flex-1 bg-black relative border-b border-white/5 z-40 flex items-center justify-center group"}>
            <iframe key={iframeSrc} className={`absolute inset-0 w-full h-full bg-transparent z-10 transition-opacity duration-500 ${iframeLoading ? 'opacity-0' : 'opacity-100'}`} src={iframeSrc} onLoad={() => setIframeLoading(false)} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-0">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#a855f7]/25 blur-xl rounded-full animate-pulse scale-150" />
                  <LevelMovieLogo className="w-10 h-10 text-[#c084fc] relative z-10 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.85)]" />
                </div>
              </div>
            )}

            {/* Notification flottante lorsqu'un nouveau commentaire arrive et que le chat est masqué */}
            {isChatHidden && floatingNotif && !isMinimized && (
              <div 
                onClick={toggleChatVisibility}
                className="absolute top-4 right-4 z-[120] max-w-[280px] sm:max-w-sm bg-[#12131d]/95 hover:bg-[#1a1b29] border border-[#a855f7]/50 shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(168,85,247,0.35)] rounded-2xl p-3 flex items-start gap-3 backdrop-blur-xl cursor-pointer transition-all animate-in fade-in slide-in-from-top-3 duration-300 hover:scale-[1.02] active:scale-95 group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center text-[#c084fc] font-black text-xs shrink-0 overflow-hidden">
                  {floatingNotif.photo ? (
                    <img src={floatingNotif.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{floatingNotif.sender?.charAt(0)?.toUpperCase() || 'P'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-0.5">
                    <span className="text-[11px] font-black text-[#c084fc] truncate">{floatingNotif.sender}</span>
                    <span className="text-[8px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Nouveau</span>
                  </div>
                  <p className="text-xs text-white/90 font-medium line-clamp-2 leading-tight">{floatingNotif.text}</p>
                  <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-[#a855f7] group-hover:text-purple-300 transition-colors">
                    <MessageSquare className="w-3 h-3" />
                    <span>{lang === 'fr' ? 'Afficher le chat pour répondre' : 'Show chat to reply'}</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFloatingNotif(null); }} 
                  className="text-white/40 hover:text-white p-1 -mr-1 -mt-1 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Controles de la vidéo en mode PIP */}
            {isMinimized && (
              <div className="absolute inset-0 z-[110] bg-black/0 group-hover:bg-black/50 active:bg-black/50 transition-colors flex items-start justify-end p-1.5 opacity-0 group-hover:opacity-100 group-active:opacity-100">
                <div className="flex gap-1.5">
                  <button onClick={() => setIsMinimized(false)} className="w-7 h-7 bg-black/70 hover:bg-[#a855f7] rounded-lg flex items-center justify-center text-white outline-none shadow-sm cursor-pointer" title={t.expandRoom}>
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => setShowLeavePartyConfirm(true)} className="w-7 h-7 bg-black/70 hover:bg-red-500 rounded-lg flex items-center justify-center text-white outline-none shadow-sm cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {isMinimized && (
              <div onClick={() => setIsMinimized(false)} className="absolute inset-0 z-[105] cursor-pointer"></div>
            )}

            {localPauseState.show && !iAmHost && !iAmMod && !isMinimized && (
              <div className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                <AlertTriangle className="w-16 h-16 md:w-24 md:h-24 text-red-500 mb-4 md:mb-6 animate-pulse" />
                <h2 className="text-xl md:text-3xl lg:text-5xl font-black text-white uppercase tracking-[0.2em] text-center px-4 mb-4 md:mb-8 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]">
                  {t.pauseRequested}
                </h2>
                <div className="bg-white/5 border border-white/10 px-6 py-4 md:px-10 md:py-6 rounded-3xl text-center mb-6 md:mb-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                  <span className="text-white/50 text-[10px] md:text-xs uppercase tracking-widest block mb-2">{t.hostPausedAt}</span>
                  <span className="text-[#a855f7] font-mono font-black text-3xl md:text-5xl drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                    {formatTimeEstimate(localPauseState.estimatedTime)}
                  </span>
                </div>
                <button onClick={() => {
                  setLocalPauseState(prev => ({ ...prev, show: false }));
                  setSyncCountdown(5);
                  let rem = 5;
                  const iv = setInterval(() => {
                    rem -= 1;
                    setSyncCountdown(rem);
                    if (rem <= 0) clearInterval(iv);
                  }, 1000);
                }} className="text-[10px] md:text-xs text-white/40 hover:text-white uppercase font-bold tracking-[0.2em] border border-white/10 px-6 py-3 rounded-full hover:bg-white/10 transition-colors outline-none shadow-sm active:scale-95 cursor-pointer">
                  {t.ignorePause}
                </button>
              </div>
            )}

            {syncCountdown > 0 && !isMinimized && (
              <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-none">
                <span className="text-[#a855f7] font-bold text-sm md:text-xl uppercase tracking-[0.5em] mb-4">{t.resumeCountdown}</span>
                <span className="text-white font-black text-8xl md:text-[150px] drop-shadow-[0_0_40px_rgba(168,85,247,0.8)] animate-pulse">{syncCountdown}</span>
              </div>
            )}
          </div>

          {!isMinimized && (
            <div className="w-full bg-[#0a0a0f] p-2.5 md:p-3.5 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-30 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3 relative border-t border-white/10">
              <div className="flex items-center justify-between w-full md:w-auto gap-2 md:gap-3 shrink-0 min-w-0">
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  <div className="w-8 h-8 md:w-9 md:h-9 bg-[#a855f7]/20 rounded-xl flex items-center justify-center border border-[#a855f7]/30 shrink-0">
                    <WatchPartySVG className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#a855f7]" />
                  </div>
                  {!isTitleCollapsed ? (
                    <div className="flex flex-col min-w-0 max-w-[140px] sm:max-w-[200px] md:max-w-[260px] animate-in fade-in duration-200">
                      <h2 className="font-black text-[11px] md:text-xs text-white uppercase tracking-wider truncate" title={partyData.roomName || partyData.title}>
                        {partyData.roomName || partyData.title}
                      </h2>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
                        <span className="text-[8px] md:text-[9px] text-white/50 uppercase font-bold tracking-wider truncate">
                          {partyData.members?.length || 1} spectateurs
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded-lg animate-in fade-in duration-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
                      <span className="text-[9px] font-mono text-[#a855f7] font-bold">
                        {partyData.members?.length || 1} live
                      </span>
                    </div>
                  )}

                  {/* Bouton pour cacher/afficher le titre pour gagner de l'espace */}
                  <button
                    type="button"
                    onClick={() => setIsTitleCollapsed(!isTitleCollapsed)}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-lg border border-white/5 transition-all text-[9px] cursor-pointer"
                    title={isTitleCollapsed ? "Afficher les infos de la salle" : "Réduire les infos de la salle pour gagner de la place"}
                  >
                    {isTitleCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-row flex-wrap gap-1.5 md:gap-2 w-full md:w-auto shrink-0 justify-between md:justify-end items-center min-w-0">
                <div className="flex gap-1.5 shrink-0 items-center">
                  {(iAmHost || iAmMod) && (
                    <>
                      <button onClick={() => { sendSystemAction('PAUSE'); handlePartySyncAction('pause'); }} className="bg-[#a855f7]/20 hover:bg-[#a855f7]/40 text-[#a855f7] border border-[#a855f7]/30 p-2 rounded-lg transition-colors outline-none shadow-sm cursor-pointer" title="Mettre en pause (Global)"><Pause className="w-3.5 h-3.5 fill-current"/></button>
                      <button onClick={() => { sendSystemAction('PLAY'); handlePartySyncAction('play_countdown'); }} className="bg-[#a855f7]/20 hover:bg-[#a855f7]/40 text-[#a855f7] border border-[#a855f7]/30 p-2 rounded-lg transition-colors outline-none shadow-sm cursor-pointer" title="Relancer (Global)"><Play className="w-3.5 h-3.5 fill-current"/></button>
                    </>
                  )}
                  <button onClick={() => sendSystemAction('ADS')} className="bg-white/5 hover:bg-white/10 text-yellow-500 p-2 rounded-lg transition-colors outline-none cursor-pointer" title="Je vois une pub"><ShieldCheck className="w-3.5 h-3.5"/></button>
                </div>

                {isTV && (
                  <div className="relative shrink-0">
                    <button onClick={() => setShowEpisodesPanel(!showEpisodesPanel)} className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl px-2.5 py-2 shadow-inner transition-colors outline-none cursor-pointer">
                      <Tv className="w-3 h-3 text-[#a855f7] shrink-0" />
                      <span className="text-white/80 font-bold text-[9px] md:text-[10px] uppercase tracking-widest whitespace-nowrap">S{selectedSeason} E{selectedEpisode}</span>
                      <ChevronDown className="w-3 h-3 text-white/40" />
                    </button>
                    {showEpisodesPanel && (
                      <div className="absolute bottom-full mb-2 right-0 w-[280px] md:w-[320px] max-h-[360px] overflow-y-auto bg-[#0f0f17] border border-white/10 rounded-2xl shadow-2xl p-3 z-[200]">
                        <div className="flex items-center justify-between mb-2 px-1">
                          <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">{t.seasonLabel} {selectedSeason}</span>
                          {!(iAmHost || iAmMod) && <span className="text-[8px] text-white/30 flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> {t.hostOnlyControl}</span>}
                        </div>
                        {details?.seasons?.length > 1 && (iAmHost || iAmMod) && (
                          <select
                            value={selectedSeason}
                            onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 mb-2 text-white/90 text-[10px] font-bold outline-none cursor-pointer"
                          >
                            {details.seasons.filter((s: any) => s.season_number > 0 || details.seasons.length === 1).map((s: any) => (
                              <option key={s.season_number} value={s.season_number} className="bg-[#151520]">{t.seasonLabel} {s.season_number}</option>
                            ))}
                          </select>
                        )}
                        {loadingEpisodes ? (
                          <div className="flex items-center justify-center py-6"><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#a855f7]"></div></div>
                        ) : seasonEpisodes.map(ep => {
                          const isCurrent = ep.episode_number === selectedEpisode;
                          const canChange = iAmHost || iAmMod;
                          return (
                            <div key={ep.id || ep.episode_number} onClick={() => canChange && handlePlayEpisode(selectedSeason, ep.episode_number)} className={`flex items-center gap-2 p-1.5 rounded-lg mb-1 ${canChange ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'} ${isCurrent ? 'bg-[#a855f7]/10 border border-[#a855f7]/40' : ''}`}>
                              <span className={`w-5 text-center text-[10px] font-black ${isCurrent ? 'text-[#a855f7]' : 'text-white/30'}`}>{ep.episode_number}</span>
                              <span className={`flex-1 truncate text-[10.5px] ${isCurrent ? 'text-white font-bold' : 'text-white/60'}`}>{ep.name || `${t.episodeLabel} ${ep.episode_number}`}</span>
                              {isCurrent && <Play className="w-3 h-3 text-[#a855f7] fill-[#a855f7] shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 shrink-0">
                  <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 shadow-inner group hover:bg-white/10 transition-colors cursor-pointer shrink-0">
                    <Server className="w-3 h-3 text-[#a855f7] mr-1.5 pointer-events-none shrink-0" />
                    <select 
                      value={selectedServer}
                      onChange={(e) => handlePlayRequest(e.target.value)}
                      className="appearance-none bg-transparent text-white/80 font-bold text-[9px] md:text-[10px] uppercase tracking-widest outline-none cursor-pointer pr-4 w-full"
                    >
                      {AVAILABLE_SERVERS.map(srv => <option key={srv.id} value={srv.id} className="bg-[#151520] text-white">{srv.name}</option>)}
                    </select>
                    <ChevronDown className="w-3 h-3 text-white/40 absolute right-2 pointer-events-none" />
                  </div>

                  {/* Bouton Signaler Pubs Serveur */}
                  <button
                    type="button"
                    onClick={() => openReportModal(selectedServer)}
                    className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300 border border-yellow-500/30 rounded-xl transition-all outline-none shrink-0 cursor-pointer active:scale-95"
                    title={lang === 'fr' ? "Signaler ce serveur (trop de pubs / redirections)" : "Report server (too many ads)"}
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* BOUTON MASQUER / AFFICHER LE CHAT (Mode Plein Écran PC / Mobile) */}
                <button
                  type="button"
                  onClick={toggleChatVisibility}
                  className={`relative px-2.5 md:px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all outline-none shrink-0 whitespace-nowrap cursor-pointer active:scale-95 ${
                    isChatHidden
                      ? 'bg-purple-600/30 hover:bg-purple-600/50 text-[#c084fc] hover:text-white border border-[#a855f7]/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10'
                  }`}
                  title={isChatHidden ? (lang === 'fr' ? "Afficher le chat" : "Show chat") : (lang === 'fr' ? "Masquer le chat pour profiter du plein écran" : "Hide chat for fullscreen")}
                >
                  {isChatHidden ? <MessageSquare className="w-3.5 h-3.5 text-[#c084fc]" /> : <MessageSquareOff className="w-3.5 h-3.5 text-white/70" />}
                  <span className="hidden sm:inline">
                    {isChatHidden ? (lang === 'fr' ? 'Afficher chat' : 'Show chat') : (lang === 'fr' ? 'Masquer chat' : 'Hide chat')}
                  </span>
                  {isChatHidden && unreadChatCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[9px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-lg animate-bounce border border-white/20">
                      {unreadChatCount > 99 ? '99+' : unreadChatCount}
                    </span>
                  )}
                </button>

                {/* BOUTON PARTAGE DANS LE HEADER AVEC FLÈCHE / MODALE */}
                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600 hover:to-pink-600 text-purple-300 hover:text-white border border-[#a855f7]/40 px-2.5 md:px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(168,85,247,0.2)] shrink-0 whitespace-nowrap cursor-pointer active:scale-95"
                  title="Partager le salon (Lien, Code, Gmail)"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Partager</span>
                </button>

                <button onClick={() => setIsMinimized(true)} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-2.5 md:px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors outline-none shadow-sm shrink-0 whitespace-nowrap cursor-pointer">
                  <Minimize2 className="w-3.5 h-3.5" /> <span className="hidden xl:inline">{t.minimizeRoom}</span>
                </button>

                {iAmMod && !iAmHost && (
                  <button onClick={() => setShowModForceCloseConfirm(true)} className="bg-orange-500/10 hover:bg-orange-500 border border-orange-500/30 hover:border-orange-500 text-orange-400 hover:text-white px-2.5 md:px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors outline-none shadow-sm shrink-0 whitespace-nowrap cursor-pointer">
                    <ShieldAlert className="w-3.5 h-3.5" /> <span className="hidden xl:inline">{t.modForceCloseBtn}</span>
                  </button>
                )}

                <button onClick={() => setShowLeavePartyConfirm(true)} className="bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white px-2.5 md:px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors outline-none shadow-sm shrink-0 whitespace-nowrap cursor-pointer">
                  <Power className="w-3.5 h-3.5" /> <span className="hidden xl:inline">{iAmHost ? t.closeLive : t.quitLive}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Colonne Droite: Chat Live Watch Party Pro */}
        {!isMinimized && !isChatHidden && (
          <div className="flex-1 lg:w-[360px] xl:w-[420px] flex flex-col bg-[#0b0b12] border-t lg:border-t-0 lg:border-l border-purple-500/20 relative z-40 min-h-0 shadow-[-25px_0_50px_rgba(0,0,0,0.9)]">
            {/* Header du Salon Live */}
            <div className="p-3 bg-[#0f0f18]/95 border-b border-white/10 backdrop-blur-xl relative z-20 shrink-0 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] shrink-0">
                  <WatchPartySVG className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black text-white uppercase tracking-wider truncate">
                      {partyData.roomName || 'Cinema Room'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-purple-300/80">
                    <span>CODE: <strong className="text-white select-all">{partyId}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(partyId);
                          if (showToast) showToast('Code du salon copié !', 'success');
                        }
                      }}
                      className="hover:text-white transition-colors cursor-pointer"
                      title="Copier le code"
                    >
                      <Copy className="w-2.5 h-2.5 inline ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600 hover:to-pink-600 text-purple-200 hover:text-white border border-[#a855f7]/40 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(168,85,247,0.25)] cursor-pointer active:scale-95"
                  title="Inviter des amis"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Inviter</span>
                </button>
              </div>
            </div>

            {/* Barre des Membres Connectés */}
            <div className="px-3 py-2 border-b border-white/5 flex gap-2.5 overflow-x-auto no-scrollbar shrink-0 items-center bg-black/40">
              <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 shrink-0 flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-400" />
                {partyData.members?.length || 1}
              </span>
              <div className="h-4 w-px bg-white/10 shrink-0" />
              {partyData.members?.map((m: any) => {
                const isMHost = m.uid === partyData.hostUid;
                const isMMod = partyData.mods?.includes(m.uid);
                return (
                  <div 
                    key={m.uid} 
                    onClick={(e) => { e.stopPropagation(); openMemberMenu(m); }} 
                    className={`relative group flex items-center shrink-0 ${m.uid !== user?.uid ? 'cursor-pointer hover:scale-105' : ''} transition-transform`}
                    title={`${m.name || 'Membre'}${isMHost ? ' (Hôte)' : isMMod ? ' (Modérateur)' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-full bg-[#181824] flex items-center justify-center font-black text-[11px] text-[#c084fc] border-[2px] shadow-sm overflow-hidden ${isMHost ? 'border-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.5)]' : (isMMod ? 'border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'border-white/20')}`}>
                      {m.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    {isMHost && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#a855f7] rounded-full border border-[#111116] flex items-center justify-center"><Star className="w-2 h-2 fill-white text-white"/></div>}
                    {isMMod && !isMHost && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-500 rounded-full border border-[#111116] flex items-center justify-center"><ShieldCheck className="w-2 h-2 fill-white text-white"/></div>}
                  </div>
                );
              })}
            </div>

            {/* Fil des Messages */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5 no-scrollbar bg-gradient-to-t from-black/90 via-black/50 to-transparent min-h-0">
              <div className="bg-gradient-to-r from-purple-900/20 via-purple-600/10 to-transparent border border-purple-500/25 p-2.5 rounded-2xl mb-2 flex gap-2.5 items-start shrink-0 shadow-inner">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-[10px] md:text-[11px] text-purple-200/90 leading-snug">
                  <strong className="font-black uppercase tracking-wider block text-purple-300 mb-0.5">{t.partyInfoPinTitle}</strong>
                  {t.partyInfoPinText}
                </div>
              </div>

              {partyData.messages?.filter((msg: any) => !partyData.muted?.some((m: any) => m.uid === msg.uid)).map((msg: any, i: number) => {
                if (msg.isSystem) {
                  let sysText = msg.text || "";
                  if (msg.action === 'JOIN') sysText = `${t.sysJoined}`;
                  else if (msg.action === 'LEAVE') sysText = `${t.sysLeft}`;
                  else if (msg.action === 'PAUSE') sysText = `${t.sysPaused}`;
                  else if (msg.action === 'PLAY') sysText = `${t.sysPlayed}`;
                  else if (msg.action === 'ADS') sysText = `${t.sysAds}`;
                  else if (msg.action === 'BAN') sysText = `${t.sysBanned} ${msg.targetName} de la room.`;
                  else if (msg.action === 'EPISODE') sysText = `${t.sysEpisode} S${msg.season} E${msg.episode}`;

                  return (
                    <div key={i} className={`flex items-start w-full group mb-1 p-1.5 rounded-xl transition-all ${msg.action === 'BAN' ? 'bg-red-500/15 border border-red-500/30' : 'bg-white/[0.02] border border-white/5'}`}>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 shrink-0 mt-0.5 shadow-sm ${msg.action === 'BAN' ? 'bg-red-500/20 border-red-500/30' : 'bg-purple-500/20 border-purple-500/30'}`}>
                        {msg.action === 'BAN' ? <UserMinus className="w-2.5 h-2.5 text-red-400" /> : <ShieldCheck className="w-2.5 h-2.5 text-purple-400" />}
                      </div>
                      <div className="flex-1 text-[11px] md:text-[12px] leading-snug break-words pt-0.5 text-white/70 italic">
                        <span className={`font-black mr-1 uppercase text-[10px] tracking-wider ${msg.action === 'BAN' ? 'text-red-400' : 'text-purple-400'}`}>Système</span>
                        <span className={msg.action === 'BAN' ? 'text-red-200' : 'text-white/70'}>{msg.name} {sysText}</span>
                      </div>
                    </div>
                  );
                }

                const msgIsHost = msg.uid === partyData.hostUid;
                const msgIsMod = partyData.mods?.includes(msg.uid);

                return (
                  <div key={i} className="flex items-start w-full group cursor-pointer hover:bg-white/[0.04] p-1.5 -mx-1 rounded-xl transition-colors chat-msg">
                    <div onClick={(e) => { e.stopPropagation(); if (msg.uid !== user?.uid) openMemberMenu(msg); }} className="mr-2.5 shrink-0 mt-0.5 hover:opacity-80 transition-opacity">
                      <LevelAvatar 
                        avatar={msg.photo || (msg.uid === user?.uid ? userPhoto : undefined)} 
                        name={msg.name} 
                        size="xs" 
                      />
                    </div>

                    <div className="flex-1 text-[12px] md:text-[13px] leading-snug break-words pt-0.5" onClick={() => { if (msg.uid !== user?.uid) setReplyingTo({ name: msg.name, text: msg.text }); }}>
                      {msg.replyTo && (
                        <div className="text-[9px] text-white/50 mb-1 flex items-center gap-1.5 border-l-2 border-purple-500 pl-1.5 bg-white/[0.02] py-0.5 rounded-r">
                          <Reply className="w-2.5 h-2.5 text-purple-400" /> <span className="truncate max-w-[200px]"><strong className="text-white/80">{msg.replyTo.name}:</strong> {msg.replyTo.text}</span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className={`font-black ${msgIsHost ? 'text-purple-400' : (msgIsMod ? 'text-blue-400' : 'text-white/80')}`}>
                          {msg.name}
                        </span>
                        {msgIsHost && <span className="bg-purple-500/20 text-purple-300 text-[8px] px-1.5 py-0.2 rounded-full uppercase font-black border border-purple-500/30">👑 Hôte</span>}
                        {msgIsMod && !msgIsHost && <span className="bg-blue-500/20 text-blue-300 text-[8px] px-1.5 py-0.2 rounded-full uppercase font-black border border-blue-500/30">🛡️ Mod</span>}
                      </div>
                      <span className="text-white/95 mt-0.5 block leading-relaxed">{msg.text}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} className="h-2 shrink-0" />
            </div>

            {/* Quick Live Reactions Bar */}
            <div className="px-3 py-1.5 bg-black/60 border-t border-white/5 flex items-center justify-between gap-1 shrink-0 overflow-x-auto no-scrollbar">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest mr-1 hidden sm:inline">Réagir</span>
              {['🔥', '🍿', '😱', '❤️', '😂', '👏', '🚀', '👑'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    handleSendPartyMessage(emoji, null);
                  }}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 text-sm flex items-center justify-center transition-all hover:scale-125 active:scale-95 cursor-pointer shadow-sm"
                  title={`Envoyer ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Barre de saisie de message professionnelle */}
            <div className="p-2.5 md:p-3 border-t border-white/10 bg-[#0c0c14]/95 backdrop-blur-xl shrink-0 z-20" style={{ paddingBottom: kbOffset > 0 ? `${kbOffset + 10}px` : '' }}>
              {replyingTo && (
                <div className="flex items-center justify-between bg-purple-950/40 px-3 py-1.5 rounded-t-xl border-x border-t border-purple-500/40 -mt-7 mb-1.5 backdrop-blur-sm">
                  <div className="text-[10px] text-white/80 truncate flex-1 flex items-center gap-1.5">
                    <Reply className="w-3 h-3 text-[#c084fc]" /> <span className="font-bold text-white">{t.replyTo} {replyingTo.name}:</span> <span className="italic truncate text-purple-200">{replyingTo.text}</span>
                  </div>
                  <button type="button" onClick={() => setReplyingTo(null)} className="text-white/40 hover:text-white p-1 outline-none cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                </div>
              )}
              <div className={`relative flex items-center bg-[#141420] border border-white/15 focus-within:border-purple-500 ${replyingTo ? 'rounded-b-2xl rounded-tr-2xl' : 'rounded-2xl'} p-1.5 transition-all shadow-[0_4px_25px_rgba(0,0,0,0.6)] focus-within:shadow-[0_0_25px_rgba(168,85,247,0.3)]`}>
                <input 
                  type="text" 
                  maxLength={150}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && chatInput.trim()) {
                      handleSendPartyMessage(chatInput, replyingTo);
                      setChatInput('');
                      setReplyingTo(null);
                    }
                  }}
                  onFocus={(e) => {
                    setTimeout(() => {
                      e.target.scrollIntoView({ behavior: 'smooth', block: 'end' });
                      chatEndRef.current?.scrollIntoView();
                    }, 300);
                  }}
                  placeholder="Écrire un message en direct..."
                  className="w-full bg-transparent pl-3 pr-2 py-2 text-xs md:text-sm text-white placeholder-white/40 outline-none font-medium"
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (chatInput.trim()) {
                      handleSendPartyMessage(chatInput, replyingTo);
                      setChatInput('');
                      setReplyingTo(null);
                    }
                  }} 
                  disabled={!chatInput.trim()}
                  className="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 disabled:from-white/5 disabled:to-white/5 disabled:text-white/20 text-white flex items-center justify-center transition-all shadow-[0_0_15px_rgba(168,85,247,0.35)] disabled:shadow-none active:scale-90 cursor-pointer disabled:cursor-not-allowed"
                  title="Envoyer le message"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MODAL STANDARD (FILM CLASSIQUE EN PLEIN ÉCRAN TOTAL)
  return (
    <div className="fixed inset-0 z-[8000] bg-[#0a0a0f] flex flex-col overflow-x-hidden overflow-y-auto no-scrollbar animate-in fade-in duration-300">
      {showDisclaimer && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0a0a0f] border border-[#a855f7]/30 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-in zoom-in duration-300">
            <h3 className="text-xl md:text-2xl font-black text-white mb-4 uppercase tracking-widest flex items-center gap-3 border-b border-white/10 pb-4">
              <AlertTriangle className="text-red-500 w-8 h-8" /> {t.warningTitle}
            </h3>
            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-[#a855f7]/50 p-5 rounded-2xl mb-6 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <h4 className="text-white font-black text-sm md:text-base mb-2 tracking-widest">{t.recommendationTitle}</h4>
              <p className="text-white/80 text-xs md:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t.recommendationText }}></p>
            </div>
            <p className="text-white/60 text-[10px] md:text-xs leading-relaxed mb-6 text-justify">{t.warningDisclaimer}</p>
            <label className="flex items-start gap-3 cursor-pointer mb-8 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors shadow-sm outline-none">
              <input type="checkbox" checked={disclaimerAccepted} onChange={(e) => setDisclaimerAccepted(e.target.checked)} className="mt-0.5 w-5 h-5 accent-[#a855f7] cursor-pointer" />
              <span className="text-white/90 text-xs md:text-sm font-bold leading-tight">{t.disclaimerCheckbox}</span>
            </label>
            <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
              <button onClick={() => setShowDisclaimer(false)} className="px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 transition-colors outline-none cursor-pointer">{t.cancel}</button>
              <button disabled={!disclaimerAccepted} onClick={() => { setShowDisclaimer(false); setSelectedServer(pendingServer); setModalMode('play'); }} className="px-8 py-3 bg-[#a855f7] text-white rounded-xl font-black text-[11px] uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] outline-none cursor-pointer">{t.acceptPlay}</button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex-1 flex flex-col bg-[#0a0a0f] z-10 relative min-h-screen">
        <div className="safe-top-header w-full bg-black/60 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-4 md:px-10 pb-3 md:pb-4 shrink-0 sticky top-0 z-[60] shadow-md">
          <div className="flex items-center gap-2">
            <LevelMovieLogo className="w-5 h-5 md:w-6 md:h-6 text-[#a855f7]" />
            <span className="text-white font-black tracking-[0.2em] text-sm md:text-base uppercase drop-shadow-md">Level<span className="text-[#a855f7]">Movie</span></span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer outline-none active:scale-90" title={t.closePlayer}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className={`relative pt-[56.25%] ${
          playerSize === 'compact' ? 'md:h-[45vh] md:max-w-4xl' :
          playerSize === 'normal' ? 'md:h-[60vh] md:max-w-6xl' :
          playerSize === 'large' ? 'md:h-[75vh] md:max-w-[92vw]' :
          'md:h-[88vh] md:max-w-full'
        } md:pt-0 w-full mx-auto bg-black shrink-0 overflow-hidden border-b border-white/10 shadow-2xl flex items-center justify-center transition-all duration-300`}>
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#060608] z-10">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[#a855f7]/25 blur-xl rounded-full animate-pulse scale-150" />
                <LevelMovieLogo className="w-10 h-10 text-[#c084fc] relative z-10 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.85)]" />
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07070b] text-center p-6 border-b border-[#a855f7]/30 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-[#a855f7]/30 flex items-center justify-center shadow-lg">
                <Server className="w-7 h-7 text-[#c084fc]" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider mb-1">
                  {lang === 'fr' ? 'Flux en cours de synchronisation' : 'Stream Synchronizing'}
                </h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  {lang === 'fr' 
                    ? 'Le serveur actuel met plus de temps que prévu à répondre. Vous pouvez basculer instantanément sur un autre miroir ou visionner la bande-annonce.' 
                    : 'The current stream server is taking longer than expected. You can switch to another mirror server or watch the official trailer.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setError(false);
                    setLoading(true);
                    const nextServer = selectedServer === 'vidsrc_me' ? 'superembed' : selectedServer === 'superembed' ? 'vidlink' : 'vidsrc_me';
                    setSelectedServer(nextServer);
                    setTimeout(() => setLoading(false), 800);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#a855f7] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  {lang === 'fr' ? 'Changer de serveur miroir' : 'Switch Mirror Server'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError(false);
                    setModalMode('trailer');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                >
                  {lang === 'fr' ? 'Bande-Annonce' : 'Trailer'}
                </button>
              </div>
            </div>
          ) : renderIframe()}
        </div>

        <div className="p-5 md:p-10 lg:p-14 shrink-0 bg-gradient-to-b from-[#15092a]/30 to-[#0a0a0f] flex-1 pb-32 w-full mx-auto">
          {modalMode === 'play' && (
            <>
              {/* SECTION CONTRÔLES DU LECTEUR EN MODE REGARDER (Serveurs, Signalement et Taille PC) */}
              <div className="mb-8 flex flex-col gap-5 bg-black/40 p-5 md:p-6 rounded-3xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-w-5xl mx-auto backdrop-blur-sm">
                
                {/* En-tête des contrôles de lecture */}
                <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center">
                      <Server className="w-3.5 h-3.5 text-[#c084fc]" />
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      {t.externalSources || 'Serveurs de streaming'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Contrôles de taille d'écran sur PC (Uniquement en mode regarder) */}
                    <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-2xl p-1 gap-1 shadow-inner">
                      <span className="text-[9px] font-bold text-white/40 uppercase px-2 flex items-center gap-1.5">
                        <Monitor className="w-3 h-3 text-[#a855f7]" />
                        <span>{lang === 'fr' ? 'Taille écran' : 'Player size'}</span>
                      </span>
                      {[
                        { id: 'compact', label: lang === 'fr' ? 'Compact' : 'Compact', title: 'Taille compacte (45vh)' },
                        { id: 'normal', label: lang === 'fr' ? 'Standard' : 'Standard', title: 'Taille équilibrée (60vh)' },
                        { id: 'large', label: lang === 'fr' ? 'Cinéma' : 'Cinema', title: 'Taille cinéma (75vh)' },
                        { id: 'full', label: lang === 'fr' ? 'Max' : 'Max', title: 'Taille plein écran (88vh)' },
                      ].map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleSetPlayerSize(s.id as any)}
                          className={`px-2.5 py-1 rounded-xl text-[9px] font-extrabold uppercase transition-all cursor-pointer ${
                            playerSize === s.id
                              ? 'bg-[#a855f7] text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                              : 'text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                          title={s.title}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => setModalMode('info')} 
                      className="text-[10px] font-bold text-white/60 hover:text-white uppercase tracking-widest border border-white/10 px-3.5 py-1.5 rounded-xl hover:bg-white/10 transition-colors outline-none cursor-pointer flex items-center gap-1.5"
                    >
                      <Info className="w-3.5 h-3.5 text-[#a855f7]" /> 
                      <span>{t.movieInfo}</span>
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-[#a855f7] font-bold uppercase tracking-widest flex items-center">
                  <Info className="w-3 h-3 inline mr-1.5" /> {t.audioTip}
                </p>

                {/* BULLE DES SERVEURS AVEC LE DRAPEAU DE SIGNALEMENT INTÉGRÉ */}
                <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                  {AVAILABLE_SERVERS.map(srv => (
                    <button 
                      key={srv.id}
                      onClick={() => handlePlayRequest(srv.id)} 
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all outline-none cursor-pointer ${
                        selectedServer === srv.id 
                          ? 'bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.35)] scale-[1.02]' 
                          : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {srv.name}
                    </button>
                  ))}

                  {/* Séparateur subtil */}
                  <div className="hidden sm:block w-px h-6 bg-white/10 mx-1"></div>

                  {/* Bouton Drapeau Signaler dans la même bulle */}
                  <button
                    type="button"
                    onClick={() => openReportModal(selectedServer)}
                    className="flex items-center gap-2 px-3.5 py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300 border border-yellow-500/30 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-sm ml-auto sm:ml-0"
                    title={lang === 'fr' ? "Signaler un serveur (pubs excessives ou panne)" : "Report server (ads or broken stream)"}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{lang === 'fr' ? 'Signaler' : 'Report'}</span>
                  </button>
                </div>
              </div>

              {isTV && (
                <div className="bg-black/40 p-5 md:p-6 rounded-2xl border border-white/5 shadow-inner max-w-5xl mx-auto">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <span className="text-[11px] font-black text-white/70 uppercase tracking-widest flex items-center gap-2">
                      <Tv className="w-4 h-4 text-[#a855f7]" /> {t.seasonLabel} {selectedSeason} — {t.episodeLabel} {selectedEpisode}
                    </span>
                    {details?.seasons?.length > 1 && (
                      <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 shadow-inner">
                        <select
                          value={selectedSeason}
                          onChange={(e) => { setSelectedSeason(parseInt(e.target.value)); setSelectedEpisode(1); }}
                          className="appearance-none bg-transparent text-white/90 font-bold text-[11px] uppercase tracking-widest outline-none cursor-pointer pr-4"
                        >
                          {details.seasons.filter((s: any) => s.season_number > 0 || details.seasons.length === 1).map((s: any) => (
                            <option key={s.season_number} value={s.season_number} className="bg-[#151520] text-white">{t.seasonLabel} {s.season_number}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-white/40 -ml-3 pointer-events-none" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
                    {loadingEpisodes ? (
                      <div className="flex items-center justify-center w-full py-10">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#a855f7]"></div>
                      </div>
                    ) : episodesError ? (
                      <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                        <p className="text-white/50 text-xs">{t.noEpisodesFound}</p>
                      </div>
                    ) : seasonEpisodes.length === 0 ? (
                      <p className="text-white/40 text-xs py-4 text-center">{t.noEpisodesFound}</p>
                    ) : seasonEpisodes.map(ep => {
                      const isCurrent = ep.episode_number === selectedEpisode;
                      return (
                        <div key={ep.id || ep.episode_number} onClick={() => handlePlayEpisode(selectedSeason, ep.episode_number)} className={`flex items-center gap-3 md:gap-4 p-2 md:p-2.5 rounded-xl cursor-pointer border transition-all ${isCurrent ? 'bg-[#a855f7]/10 border-[#a855f7]/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'}`}>
                          <span className={`w-6 md:w-7 shrink-0 text-center font-black text-sm md:text-base ${isCurrent ? 'text-[#a855f7]' : 'text-white/30'}`}>{ep.episode_number}</span>
                          <div className="relative w-[110px] md:w-[140px] aspect-video shrink-0 rounded-lg overflow-hidden bg-[#151520]">
                            {ep.still_path ? (
                              <img src={`${IMAGE_BASE_URL}${ep.still_path}`} className="w-full h-full object-cover" loading="lazy" draggable="false" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Film className="w-5 h-5 text-white/20" /></div>
                            )}
                            {isCurrent && (
                              <div className="absolute inset-0 bg-[#a855f7]/30 flex items-center justify-center backdrop-blur-[1px]">
                                <div className="w-7 h-7 md:w-8 md:h-8 bg-[#a855f7] rounded-full flex items-center justify-center shadow-lg">
                                  <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[12px] md:text-[13px] font-bold truncate ${isCurrent ? 'text-white' : 'text-white/80'}`}>{ep.name || `${t.episodeLabel} ${ep.episode_number}`}</p>
                            {ep.overview && <p className="hidden md:block text-[10.5px] text-white/40 leading-snug line-clamp-2 mt-1">{ep.overview}</p>}
                            {ep.air_date && <p className="text-[9.5px] text-white/30 mt-1 md:mt-0.5">{ep.air_date}</p>}
                          </div>
                          {isCurrent && <Play className="w-4 h-4 text-[#a855f7] shrink-0 mr-1 fill-[#a855f7]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {(modalMode === 'info' || modalMode === 'trailer') && details && (
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 max-w-7xl mx-auto">
              <div className="flex-1">
                <h2 className="text-4xl md:text-6xl font-black mb-4 text-white uppercase tracking-tighter drop-shadow-lg leading-tight">
                  {movie.title || movie.name || movie.original_name}
                </h2>
                <div className="text-[#a855f7] italic text-base md:text-lg font-medium mb-6 drop-shadow-sm flex items-center gap-2">
                  <span>{details.tagline ? `"${details.tagline}"` : ''}</span>
                </div>

                <div className="flex items-center space-x-4 mb-8 flex-wrap gap-y-4">
                  <span className="text-green-400 font-black text-xs md:text-sm uppercase tracking-widest border border-green-400/30 px-3 py-1.5 rounded bg-green-400/10 shadow-sm">{t.match}</span>
                  {details.status && <span className="text-blue-400 font-bold text-xs md:text-sm uppercase tracking-widest border border-blue-400/30 px-3 py-1.5 rounded bg-blue-400/10">{details.status}</span>}
                  <span className="text-white/80 font-bold text-sm md:text-base border-l border-white/20 pl-4">{(movie.release_date || movie.first_air_date || '').substring(0, 4)}</span>
                  <span className="text-white/80 font-bold text-sm md:text-base border-l border-white/20 pl-4">{getFormatRuntime()}</span>
                  {details.original_language && <span className="text-white/60 font-bold text-xs uppercase tracking-widest border-l border-white/20 pl-4">{t.originalLang}: {details.original_language.toUpperCase()}</span>}
                  <span className="px-2.5 py-1.5 border border-white/20 rounded text-[10px] font-bold text-white uppercase tracking-widest bg-white/5 shadow-sm border-l border-white/20 pl-4 ml-2">HD 1080p</span>
                </div>

                <div className="mb-6">
                  <span className="text-white/40 font-bold text-[10px] uppercase tracking-widest block mb-1">{t.originalTitle}</span>
                  <span className="text-white/70 font-medium text-sm italic">{details.original_title || details.original_name || t.notSpecified}</span>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8">
                  {isUpcomingRelease ? (
                    <button onClick={() => handleSetReleaseReminder(movie, details)} disabled={reminderSet} className={`flex-1 items-center justify-center flex gap-3 px-6 py-4 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest transition-all active:scale-95 outline-none ${reminderSet ? 'bg-green-500/10 border border-green-500/40 text-green-400 cursor-default' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 shadow-[0_0_30px_rgba(168,85,247,0.4)] cursor-pointer'}`}>
                      {reminderSet ? <><CheckCircle className="w-5 h-5" /> <span>{t.reminderSetBtn}</span></> : <><Info className="w-5 h-5" /> <span>{t.notifyReleaseBtn}</span></>}
                    </button>
                  ) : (
                    <button onClick={() => handlePlayRequest(selectedServer)} className="flex-1 items-center justify-center flex gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs md:text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-95 outline-none cursor-pointer">
                      <Play className="w-5 h-5 fill-white" /> <span>{t.playMovie}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (modalMode !== 'trailer') {
                        setIframeLoading(true);
                        setModalMode('trailer');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    disabled={modalMode === 'trailer'}
                    className={`flex-1 items-center justify-center flex gap-3 px-6 py-4 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest transition-all active:scale-95 outline-none cursor-pointer ${
                      modalMode === 'trailer'
                        ? 'bg-[#a855f7]/10 border border-[#a855f7]/50 text-[#a855f7] cursor-default shadow-inner'
                        : 'bg-white/5 border border-white/20 text-white hover:bg-white/10 backdrop-blur-md shadow-md'
                    }`}
                  >
                    {modalMode === 'trailer' ? (
                      <>
                        <div className="flex gap-1.5 items-center justify-center">
                          <div className="w-2 h-2 bg-[#a855f7] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#a855f7] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-[#a855f7] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        <span>{t.trailerPlaying}</span>
                      </>
                    ) : (
                      <><Clapperboard className="w-5 h-5" /> <span>{t.trailer}</span></>
                    )}
                  </button>

                  <button onClick={() => handleCreateParty(movie)} className="flex-1 items-center justify-center flex gap-3 px-6 py-4 bg-white/5 border border-[#a855f7]/50 text-white rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-[#a855f7]/20 hover:border-[#a855f7] transition-all active:scale-95 outline-none shadow-md cursor-pointer">
                    <WatchPartySVG className="w-5 h-5 text-[#a855f7]" /> <span>{t.createPartyBtn}</span>
                  </button>
                </div>

                <div className="markdown-pro pr-2 text-justify text-base md:text-lg leading-relaxed text-white/80">
                  {movie.overview ? movie.overview.split('\n').filter((p: string) => p.trim()).map((p: string, i: number) => <p key={i} className="mb-4">{p}</p>) : <p>{t.noDesc}</p>}
                </div>

                <div className="mt-10 flex gap-4 pt-8 border-t border-white/10">
                  <button onClick={() => toggleWatchlist(movie)} className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border transition-all active:scale-95 outline-none cursor-pointer ${isAddedToWatchlist ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'}`}>
                    {isAddedToWatchlist ? <><CheckCircle className="w-6 h-6" /><span className="text-xs md:text-sm font-bold uppercase tracking-widest">{t.alreadyInList}</span></> : <><Plus className="w-6 h-6 text-[#a855f7]" /><span className="text-xs md:text-sm font-bold uppercase tracking-widest">{t.addToList}</span></>}
                  </button>
                  <button onClick={handleShare} className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-95 outline-none cursor-pointer">
                    <Share2 className="w-6 h-6 text-blue-400" />
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-[40%] space-y-8 bg-black/40 p-6 md:p-8 rounded-3xl border border-white/5 shadow-inner h-fit">
                <div>
                  <span className="text-white/40 font-bold block mb-4 uppercase tracking-widest text-xs flex items-center gap-2"><Users className="w-5 h-5 text-[#a855f7]" /> <span>{t.cast}</span></span>
                  <div className="flex gap-5 overflow-x-auto no-scrollbar pb-3 row-container cursor-grab active:cursor-grabbing">
                    {details.credits?.cast?.slice(0, 15).map((c: any) => (
                      <div key={c.id} className="flex flex-col items-center min-w-[80px] gap-2 shrink-0 select-none">
                        <img src={c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=151520&color=a855f7`} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-white/10 shadow-md bg-black/50" draggable="false" alt=""/>
                        <span className="text-[10px] md:text-xs text-white/90 text-center font-bold w-[90px] truncate px-1">{c.name}</span>
                        {c.character && <span className="text-[9px] md:text-[10px] text-[#a855f7] truncate w-[90px] text-center">{c.character}</span>}
                      </div>
                    )) || <span className="text-white/50 text-sm">{t.noCasting}</span>}
                  </div>
                </div>
                <div className="w-full h-px bg-white/10"></div>
                <div>
                  <span className="text-white/40 font-bold block mb-2 uppercase tracking-widest text-xs flex items-center gap-2"><Film className="w-5 h-5 text-[#a855f7]" /> <span>{t.director}</span></span>
                  <span className="text-white/90 font-medium text-sm block mt-2">{getDirector()}</span>
                </div>

                {/* Sources Légales & Plateformes Officielles (Netflix, Prime, Disney+, etc.) */}
                {(() => {
                  const wp = getWatchProviders();
                  const isFr = lang === 'fr' || lang === 'fr-FR';
                  const flatrate: any[] = wp?.flatrate || [];
                  const rent: any[] = wp?.rent || [];
                  const buy: any[] = wp?.buy || [];
                  const hasAny = flatrate.length > 0 || rent.length > 0 || buy.length > 0;

                  return (
                    <>
                      <div className="w-full h-px bg-white/10"></div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-white/40 font-bold block uppercase tracking-widest text-xs flex items-center gap-2">
                            <Tv className="w-4 h-4 text-[#a855f7]" />
                            <span>{isFr ? 'Disponibilité Légale (VOD)' : 'Official Platforms (VOD)'}</span>
                          </span>
                          {wp?.link && (
                            <a
                              href={wp.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-mono text-[#a855f7] hover:text-[#c084fc] flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <span>JustWatch</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {hasAny ? (
                          <div className="space-y-3.5">
                            {/* SVOD / Streaming par Abonnement */}
                            {flatrate.length > 0 && (
                              <div>
                                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-2">
                                  {isFr ? 'Streaming (Abonnement)' : 'Streaming'}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {flatrate.map((p: any) => (
                                    <div
                                      key={p.provider_id}
                                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#a855f7]/40 transition-all shadow-sm"
                                      title={p.provider_name}
                                    >
                                      <img
                                        src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                        alt={p.provider_name}
                                        className="w-5 h-5 rounded-md object-cover shadow"
                                      />
                                      <span className="text-xs font-semibold text-white/90">{p.provider_name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Achat & Location */}
                            {(rent.length > 0 || buy.length > 0) && (
                              <div>
                                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-2">
                                  {isFr ? 'Achat & Location' : 'Rent & Buy'}
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {[...rent, ...buy.filter((b: any) => !rent.some((r: any) => r.provider_id === b.provider_id))].slice(0, 6).map((p: any) => (
                                    <div
                                      key={p.provider_id}
                                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/5"
                                      title={p.provider_name}
                                    >
                                      <img
                                        src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                        alt={p.provider_name}
                                        className="w-4 h-4 rounded object-cover"
                                      />
                                      <span className="text-[11px] text-white/70">{p.provider_name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-white/40 italic py-1">
                            {isFr ? 'Aucun diffuseur SVOD listé pour ce titre actuellement.' : 'No direct SVOD provider listed for this title currently.'}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {details && details.similar?.results?.length > 0 && (
            <div className="mt-16 pt-10 border-t border-white/10 max-w-7xl mx-auto">
              <h3 className="text-white/90 text-lg md:text-xl font-black mb-6 uppercase tracking-[0.2em] border-l-4 border-[#a855f7] pl-4">{t.similar}</h3>
              <div className="flex overflow-x-auto gap-5 no-scrollbar pb-6 row-container cursor-grab active:cursor-grabbing">
                {details.similar.results.slice(0, 10).map((sm: any) => {
                  if (!sm.poster_path) return null;
                  return (
                    <div key={sm.id} className="relative flex-none cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-white/5 bg-[#151520] hover:scale-105 transition-transform w-[140px] md:w-[180px] h-[210px] md:h-[270px]" onClick={() => onSelectSimilar(sm)}>
                      <img className="object-cover w-full h-full" src={`${IMAGE_BASE_URL}${sm.poster_path}`} loading="lazy" draggable="false" alt=""/>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

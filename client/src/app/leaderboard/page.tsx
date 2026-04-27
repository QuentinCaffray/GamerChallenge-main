'use client';
import { Fragment, useEffect, useState } from 'react';
import PodiumStars from './component/starry-background';
import { useAuth } from '../context/AuthContext';
import PageBanner from '@/component/PageBanner';

export default function Leaderboard() {
  // BDD types
  type UsersLiked = { username: string; totalLikes: number };
  type Participation = { username: string; participationCount: number };
  type UserRank = {
    byLikes: { rank: number; totalLikes: number };
    byParticipations: { rank: number; participationCount: number };
  };

  // New type which can be used to all the function for the leaderboard
  type LeaderboardUser = {
    username: string;
    score: number;
    rank?: number;
  };

  const { user } = useAuth();
  const currentUsername = user?.username;

  const [usersLikedLeaderboard, setUsersLikedLeaderboard] = useState<UsersLiked[]>([]);
  const [participationLeaderboard, setParticipationLeaderboard] = useState<Participation[]>([]);
  const [userConnected, setUserConnected] = useState<UserRank>();
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<'likes' | 'participation'>(
    'likes'
  );

  useEffect(() => {
    async function getLeaderboard() {
      const registerUrl = `${process.env.API_URL}/leaderboard`;
      const response = await fetch(registerUrl, {
        credentials: 'include'
      });
      const replyDb = await response.json();

      setUsersLikedLeaderboard(replyDb.topByLikes);
      setParticipationLeaderboard(replyDb.topByParticipations);
      setUserConnected(replyDb.currentUserRank);
    }

    getLeaderboard();
  }, []);

  // Normalize the leaderboard format to a unique one
  function normalizeLeaderboardData(data: UsersLiked[] | Participation[]): LeaderboardUser[] {
    return data.map((user) => ({
      username: user.username,
      score: 'totalLikes' in user ? user.totalLikes : user.participationCount
    }));
  }

  // Add suffix to rank
  function getOrdinalSuffix(num: number) {
    if (num > 3 && num < 21) {
      return 'th';
    }
    switch (num % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  // Sort and add rank to users
  function getSortedArrayWithRanks(
    userArray: LeaderboardUser[]
  ): (LeaderboardUser & { rank: number })[] {
    // Delete if the connected user is a part of the top 10 leaderboard
    const uniqueUsers = userArray.filter(
      (user, index, self) => index === self.findIndex((u) => u.username === user.username)
    );

    // Sort all users
    const sorted = uniqueUsers.sort((a, b) => b.score - a.score);

    // Add rank to users
    return sorted.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  }

  // To create the coloring for the leaderboard
  function getBgClass(rank: number, isCurrentUser: boolean): string {
    if (isCurrentUser) {
      if (rank === 1) {
        return 'bg-(--leadboard-first) ';
      }
      if (rank === 2) {
        return 'bg-(--leadboard-second)';
      }
      if (rank === 3) {
        return 'bg-(--leadboard-third)';
      }
      return 'bg-(--leadboard-me)';
    }
    if (rank === 1) {
      return 'bg-(--leadboard-first) mb-5 p-4 bg-linear-to-r from-(--leadboard-first) via-(--leadboard-third) to-(--leadboard-first) animate-rainbow drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] bg-size-[200%_200%]';
    }

    if (rank === 2) {
      return 'bg-(--leadboard-second) mb-3 p-3';
    }
    if (rank === 3) {
      return 'bg-(--leadboard-third) mb-2.5 p-2.5';
    }
    return rank % 2 ? 'bg-(--leadboard-mix-one)' : 'bg-(--leadboard-mix-two)';
  }

  // To show the users on the leaderboard
  function renderUserItem(user: LeaderboardUser & { rank: number }, isCurrentUser = false) {
    const { rank, username, score } = user;
    const bgClass = getBgClass(rank, isCurrentUser);
    const rankText = `${rank}${getOrdinalSuffix(rank)}`;
    const isPodium = rank <= 3 && !isCurrentUser;
    const isFirst = rank === 1 && !isCurrentUser;

    return (
      <Fragment key={`${username}-${rank}`}>
        <li className={`${isCurrentUser ? 'block mt-5 mb-1' : 'hidden'}`}>
          <p>Your rank :</p>
        </li>
        <li
          className={`flex justify-between ${bgClass}  rounded-2xl p-2 mb-2 ${isCurrentUser ? 'mb-3' : ''} relative overflow-hidden`}
        >
          {/* Starry effect for the three first place*/}
          {isPodium && <PodiumStars />}

          <div className="flex relative z-10">
            <p className={`ml-2 content-center ${isFirst ? `text-5xl ` : ''}`}>{rankText}</p>
            <p className={`ml-5 font-bold content-center ${isFirst ? `text-5xl ` : ''}`}>
              {username}
            </p>
          </div>
          <p className={`mr-5 relative z-10 content-center ${isFirst ? `text-5xl ` : ''}`}>
            {score}
          </p>
        </li>
      </Fragment>
    );
  }

  // Render the leaderboard
  function renderLeaderboard(
    userArray: LeaderboardUser[],
    leaderboardType: 'likes' | 'participation'
  ) {
    const sortedUsers = getSortedArrayWithRanks(userArray);
    const currentUser = sortedUsers.find((user) => user.username === currentUsername);

    let connectedUserData: (LeaderboardUser & { rank: number }) | null = null;
    if (userConnected && currentUsername && !currentUser) {
      if (leaderboardType === 'likes') {
        connectedUserData = {
          username: currentUsername,
          score: userConnected.byLikes.totalLikes,
          rank: userConnected.byLikes.rank
        };
      } else {
        connectedUserData = {
          username: currentUsername,
          score: userConnected.byParticipations.participationCount,
          rank: userConnected.byParticipations.rank
        };
      }
    }

    // Function to show an empty place instead of showing deleting it
    function renderEmptySlot(rank: number) {
      const bgClass = getBgClass(rank, false);
      const rankText = `${rank}${getOrdinalSuffix(rank)}`;

      return (
        <li
          key={`empty-${rank}`}
          className={`flex justify-between ${bgClass} rounded-2xl p-2 mb-2 opacity-50`}
        >
          <p>{rankText}</p>
          <div className="flex">
            <p className="mr-5 text-(--leadboard-me) italic">-</p>
            <p className="ml-5 text-(--leadboard-me)">-</p>
          </div>
        </li>
      );
    }

    // Create a 10 slot array, put the actual player from the bdd and keep the empty slot
    const leaderboardSlots = Array.from({ length: 10 }, (_, index) => {
      const rank = index + 1;
      const user = sortedUsers[index];

      if (user) {
        // actual user
        return renderUserItem(user);
      } else {
        // Empty slot
        return renderEmptySlot(rank);
      }
    });

    return (
      <>
        {/* To always have 10 slot even if empty */}
        {leaderboardSlots}

        {/* Connected user always shown on the bottom of the leaderboard */}

        {currentUser && renderUserItem(currentUser, true)}
        {connectedUserData && renderUserItem(connectedUserData, true)}
      </>
    );
  }

  // To select which leaderboard to show on mobile
  const currentLeaderboardData =
    selectedLeaderboard === 'likes'
      ? normalizeLeaderboardData(usersLikedLeaderboard)
      : normalizeLeaderboardData(participationLeaderboard);

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <PageBanner title="LEADERBOARD" />
      <section className="flex justify-center flex-col">
        <div className="flex justify-center mr-5">
          {/* Mobile: selection button*/}
          <button
            type="button"
            onClick={() => setSelectedLeaderboard('likes')}
            className={`lg:hidden p-2 ml-5 ${selectedLeaderboard === 'likes' ? 'bg-(--button-area)' : 'bg-(--background-header)'} rounded-t-2xl w-full`}
          >
            Most liked players
          </button>

          {/* Desktop: fix title "Most liked players" */}
          <div className="lg:w-full lg:text-center lg:mr-15">
            <p className="lg:p-2 lg:ml-5 rounded-t-2xl w-full bg-(--button-area) hidden lg:block">
              Most liked players
            </p>
          </div>

          {/* Mobile: button "Most participation" */}
          <button
            type="button"
            onClick={() => setSelectedLeaderboard('participation')}
            className={`lg:hidden p-2 ${selectedLeaderboard === 'participation' ? 'bg-(--button-area)' : 'bg-(--background-header)'} rounded-t-2xl w-full`}
          >
            Most participation
          </button>

          {/* Desktop: fix title  pour "Most participation" */}
          <div className="lg:w-full lg:text-center lg:mr-5">
            <p className="lg:p-2 lg:ml-5 rounded-t-2xl w-full bg-(--button-area) hidden lg:block">
              Most participation
            </p>
          </div>
        </div>

        <div className="lg:flex">
          {/* Mobile: show selected leaderboard */}
          <ul className="flex justify-center flex-col lg:hidden ml-5 mr-5  bg-(--button-area) p-3 mb-5 rounded-b-3xl">
            {renderLeaderboard(currentLeaderboardData, selectedLeaderboard)}
          </ul>

          {/* Desktop: show all leaderboard */}
          <ul className="hidden lg:flex lg:justify-center lg:w-full lg:flex-col lg:ml-5 lg:mr-0  lg:bg-(--button-area) lg:p-3 lg:mb-5 lg:rounded-b-3xl">
            {renderLeaderboard(normalizeLeaderboardData(usersLikedLeaderboard), 'likes')}
          </ul>

          <ul className="hidden lg:flex lg:justify-center lg:w-full lg:flex-col lg:mr-5  lg:bg-(--button-area) lg:p-3 lg:mb-5 lg:ml-15 lg:rounded-b-3xl">
            {renderLeaderboard(normalizeLeaderboardData(participationLeaderboard), 'participation')}
          </ul>
        </div>
      </section>
    </main>
  );
}

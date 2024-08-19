// import styles from './roomInPage.module.css';

import React from 'react';
import { useState } from 'react';
import { OpenViduSession } from '../../components/organisms/openViduSession'; // 세션 관련 컴포넌트 import

export const RoomInPage = () => {
  const [sessionID, setSessionID] = useState('');

  const [userName, setUserName] = useState('');

  const [session, setSession] = useState(false);

  const handleChangeSessionId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSessionID(e.target.value);
  };

  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleJoinSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSession(true);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {!session && (
        <div className="w-full max-w-none flex items-center justify-center">
          <div
            id="join"
            className="w-[400px] border border-gray-200 shadow-lg rounded-lg p-6 bg-white mx-auto"
          >
            <form
              className="form-group space-y-4 w-full"
              onSubmit={handleJoinSession}
            >
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  User:{' '}
                </label>
                <input
                  className="form-control w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="text"
                  id="userName"
                  placeholder="your name"
                  value={userName}
                  onChange={handleChangeUserName}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Session:{' '}
                </label>
                <input
                  className="form-control w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="text"
                  id="sessionId"
                  placeholder="session"
                  value={sessionID}
                  onChange={handleChangeSessionId}
                  required
                />
              </div>
              <div className="text-center">
                <input
                  className="btn btn-lg bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 cursor-pointer"
                  name="commit"
                  type="submit"
                  value="JOIN"
                />
              </div>
            </form>
          </div>
        </div>
      )}
      {session && (
        <div className="w-full h-full flex items-center justify-center max-w-none">
          <OpenViduSession mySessionId={sessionID} myUserName={userName} />
        </div>
      )}
    </div>
  );
};

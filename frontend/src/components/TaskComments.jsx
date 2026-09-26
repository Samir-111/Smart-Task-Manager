'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Send,
  Sparkles,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
} from 'lucide-react';

export function TaskComments({ taskId, taskTitle, assignedUser }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedTag, setSelectedTag] = useState('Update');

  const tags = [
    { label: 'Update', bg: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
    { label: 'Testing', bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    { label: 'Blocked', bg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
    { label: 'Note', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
  ];

  // Load comments from localStorage
  useEffect(() => {
    if (!taskId) return;
    const storageKey = `smarttask_comments_${taskId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved comments', e);
      }
    } else {
      // Default initial comment for realistic collaborative feel
      const initialComment = [
        {
          id: `c-init-${taskId}`,
          author: assignedUser?.name || 'System Auto-Log',
          email: assignedUser?.email || 'system@smarttask.ai',
          text: `Task initiated and assigned to ${assignedUser?.name || 'team member'}. Prerequisite validation active.`,
          tag: 'Update',
          timestamp: 'Sprint Kickoff',
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      setComments(initialComment);
      localStorage.setItem(storageKey, JSON.stringify(initialComment));
    }
  }, [taskId, assignedUser]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const authorName = user?.name || 'Team Contributor';
    const authorEmail = user?.email || 'contributor@smarttask.ai';

    const commentObj = {
      id: `c-${Date.now()}`,
      author: authorName,
      email: authorEmail,
      text: newComment.trim(),
      tag: selectedTag,
      timestamp: 'Just now',
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [commentObj, ...comments];
    setComments(updated);
    localStorage.setItem(`smarttask_comments_${taskId}`, JSON.stringify(updated));
    setNewComment('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-2xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Task Activity & Updates
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Team collaboration notes & progress logs ({comments.length})
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700">
          Live Thread
        </span>
      </div>

      {/* Input Box */}
      <form onSubmit={handleAddComment} className="space-y-2.5">
        <div className="relative">
          <textarea
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={`Add a progress update as ${user?.name || 'member'}... (e.g. "Tested on staging", "API ready")`}
            className="w-full p-3 bg-slate-50/90 dark:bg-slate-800/90 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 transition-all resize-none"
          />
        </div>

        {/* Quick Tag Selector + Post Button */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Tag:</span>
            {tags.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setSelectedTag(t.label)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  selectedTag === t.label
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs scale-102'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!newComment.trim()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs active:scale-98"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Update</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 max-h-72 overflow-y-auto pr-1">
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-1.5 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-600 to-slate-900 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs shrink-0">
                  {c.author.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {c.author}
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {c.tag}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium shrink-0">
                {c.timestamp || c.date}
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 pl-8 leading-relaxed">
              {c.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

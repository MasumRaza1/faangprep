import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronDown, ChevronRight, Plus, Trash2, CheckCircle, Circle, X, Book, Edit } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Subject, Topic, SubTopic } from '../../types';

// SubtopicItem component for recursive rendering
const SubtopicItem: React.FC<{
  subtopic: SubTopic;
  subjectId: string;
  topicId: string;
  parentSubtopicPath?: string[];
  level: number;
  theme: { mode: 'light' | 'dark' };
  onToggleCompletion: () => void;
  onRemove: () => void;
}> = ({
  subtopic,
  subjectId,
  topicId,
  parentSubtopicPath = [],
  level,
  theme,
  onToggleCompletion,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingSubtopic, setIsAddingSubtopic] = useState(false);
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtopic.title);
  const { dispatch } = useApp();

  // Ensure subtopics array exists
  const subtopics = subtopic.subtopics || [];
  const currentPath = [...parentSubtopicPath, subtopic.id];

  const handleAddSubtopic = () => {
    if (newSubtopicTitle.trim() === '') return;

    const newSubtopic = {
      id: uuidv4(),
      title: newSubtopicTitle,
      completed: false,
      scheduledDate: null,
      subtopics: [] // Initialize empty subtopics array for nesting
    };

    // If we have a parent path, use nested dispatch
    if (parentSubtopicPath.length > 0) {
      dispatch({
        type: 'ADD_NESTED_SUBTOPIC',
        subjectId,
        topicId,
        parentSubtopicId: subtopic.id,
        subtopic: newSubtopic,
      });
    } else {
      // Direct subtopic of a topic
      dispatch({
        type: 'ADD_SUBTOPIC',
        subjectId,
        topicId,
        subtopic: newSubtopic,
      });
    }

    setNewSubtopicTitle('');
    setIsAddingSubtopic(false);
    setIsExpanded(true); // Auto-expand when adding new subtopic
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() === '') return;

    dispatch({
      type: 'EDIT_SUBTOPIC',
      subjectId,
      topicId,
      subtopicId: subtopic.id,
      title: editTitle
    });

    setIsEditing(false);
  };

  return (
    <li className="space-y-2">
      <div className={`flex items-start group rounded-lg transition-colors duration-150 ${
        theme.mode === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
      }`}>
        <button 
          className="mr-2 mt-1.5" 
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompletion();
          }}
        >
          {subtopic.completed ? (
            <CheckCircle size={16} className="text-green-500" />
          ) : (
            <Circle size={16} className="text-gray-400" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div 
            className="flex items-center justify-between py-1 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className={`flex items-center min-w-0 ${subtopic.completed ? 'line-through text-gray-400' : ''}`}>
              <span className="mr-1 flex-shrink-0">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
              {isEditing ? (
                <div className="flex items-center space-x-2 flex-1 min-w-0" onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={`flex-1 p-1 text-sm border rounded ${
                      theme.mode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveEdit();
                      }
                    }}
                  />
                  <button
                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleSaveEdit}
                  >
                    <LucideIcons.Check size={14} />
                  </button>
                  <button
                    className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={() => {
                      setEditTitle(subtopic.title);
                      setIsEditing(false);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <span className="truncate">{subtopic.title}</span>
              )}
            </div>
            {!isEditing && (
              <div 
                className="flex items-center space-x-1 opacity-0 group-hover:opacity-100" 
                onClick={e => e.stopPropagation()}
              >
                <button
                  className={`p-1 rounded hover:bg-opacity-80 ${
                    theme.mode === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                  onClick={() => setIsAddingSubtopic(true)}
                  title="Add sub-subtopic"
                >
                  <Plus size={14} />
                </button>
                <button
                  className={`p-1 rounded hover:bg-opacity-80 ${
                    theme.mode === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                  onClick={() => setIsEditing(true)}
                  title="Edit subtopic"
                >
                  <LucideIcons.Edit size={14} />
                </button>
                <button
                  className={`p-1 rounded hover:bg-opacity-80 ${
                    theme.mode === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                  onClick={onRemove}
                  title="Remove subtopic"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
          
          {isAddingSubtopic && (
            <div 
              className="flex items-center mt-2 pl-4 pr-2 pb-2" 
              onClick={e => e.stopPropagation()}
            >
              <input
                type="text"
                value={newSubtopicTitle}
                onChange={(e) => setNewSubtopicTitle(e.target.value)}
                placeholder="New sub-subtopic"
                className={`flex-1 p-1.5 text-sm border rounded ${
                  theme.mode === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSubtopic();
                  }
                }}
                autoFocus
              />
              <button
                className="ml-2 p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleAddSubtopic}
              >
                <Plus size={14} />
              </button>
              <button
                className="ml-1 p-1.5 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setIsAddingSubtopic(false)}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {(isExpanded || isAddingSubtopic) && subtopics.length > 0 && (
        <ul className={`pl-6 space-y-2 ${
          level > 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''
        }`}>
          {subtopics.map((subsubtopic) => (
            <SubtopicItem
              key={subsubtopic.id}
              subtopic={subsubtopic}
              subjectId={subjectId}
              topicId={topicId}
              parentSubtopicPath={currentPath}
              level={level + 1}
              theme={theme}
              onToggleCompletion={() =>
                dispatch({
                  type: 'TOGGLE_NESTED_SUBTOPIC_COMPLETION',
                  subjectId,
                  topicId,
                  subtopicPath: [...currentPath, subsubtopic.id]
                })
              }
              onRemove={() =>
                dispatch({
                  type: 'REMOVE_NESTED_SUBTOPIC',
                  subjectId,
                  topicId,
                  subtopicPath: [...currentPath, subsubtopic.id]
                })
              }
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const SubjectList: React.FC = () => {
  const { state, dispatch, getCompletionPercentage } = useApp();
  const { theme } = useTheme();
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [addingTopicForSubject, setAddingTopicForSubject] = useState<string | null>(null);
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [addingSubtopicForTopic, setAddingSubtopicForTopic] = useState<{
    subjectId: string;
    topicId: string;
  } | null>(null);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [newSubjectDescription, setNewSubjectDescription] = useState('');
  
  // Edit states
  const [editingSubject, setEditingSubject] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);
  const [editingTopic, setEditingTopic] = useState<{
    subjectId: string;
    topicId: string;
    title: string;
  } | null>(null);
  const [editingSubtopic, setEditingSubtopic] = useState<{
    subjectId: string;
    topicId: string;
    subtopicId: string;
    title: string;
  } | null>(null);

  const toggleSubjectExpand = (subjectId: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const handleAddTopic = (subjectId: string) => {
    if (newTopicTitle.trim() === '') return;

    const newTopic = {
      id: uuidv4(),
      title: newTopicTitle,
      completed: false,
      subtopics: [],
      scheduledDate: null,
    };

    dispatch({
      type: 'ADD_TOPIC',
      subjectId,
      topic: newTopic,
    });

    setNewTopicTitle('');
    setAddingTopicForSubject(null);
    
    setExpandedTopics((prev) => ({
      ...prev,
      [newTopic.id]: true,
    }));
  };

  const handleRemoveTopic = (subjectId: string, topicId: string) => {
    dispatch({
      type: 'REMOVE_TOPIC',
      subjectId,
      topicId,
    });
  };

  const handleAddSubtopic = (subjectId: string, topicId: string) => {
    if (newSubtopicTitle.trim() === '') return;

    const newSubtopic = {
      id: uuidv4(),
      title: newSubtopicTitle,
      completed: false,
      scheduledDate: null,
      subtopics: [] // Initialize empty subtopics array
    };

    dispatch({
      type: 'ADD_SUBTOPIC',
      subjectId,
      topicId,
      subtopic: newSubtopic,
    });

    setNewSubtopicTitle('');
    setAddingSubtopicForTopic(null);
    
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: true,
    }));
  };

  const handleRemoveSubtopic = (subjectId: string, topicId: string, subtopicId: string) => {
    dispatch({
      type: 'REMOVE_SUBTOPIC',
      subjectId,
      topicId,
      subtopicId,
    });
  };

  const handleToggleTopicCompletion = (subjectId: string, topicId: string) => {
    dispatch({
      type: 'TOGGLE_TOPIC_COMPLETION',
      subjectId,
      topicId,
    });
  };

  const handleToggleSubtopicCompletion = (
    subjectId: string,
    topicId: string,
    subtopicId: string
  ) => {
    dispatch({
      type: 'TOGGLE_SUBTOPIC_COMPLETION',
      subjectId,
      topicId,
      subtopicId,
    });
  };

  const handleAddSubject = () => {
    if (newSubjectTitle.trim() === '') return;

    const newSubject = {
      id: uuidv4(),
      title: newSubjectTitle,
      icon: 'Book',
      description: newSubjectDescription || 'No description provided',
      topics: [],
      schedule: {
        startDate: new Date(),
        totalDays: 30,
        endDate: new Date(new Date().setDate(new Date().getDate() + 30))
      }
    };

    dispatch({
      type: 'ADD_SUBJECT',
      subject: newSubject,
    });

    setNewSubjectTitle('');
    setNewSubjectDescription('');
    setIsAddingSubject(false);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject({
      id: subject.id,
      title: subject.title,
      description: subject.description
    });
  };

  const handleSaveSubjectEdit = () => {
    if (!editingSubject) return;

    dispatch({
      type: 'EDIT_SUBJECT',
      subjectId: editingSubject.id,
      title: editingSubject.title,
      description: editingSubject.description
    });

    setEditingSubject(null);
  };

  const handleEditTopic = (subjectId: string, topic: Topic) => {
    setEditingTopic({
      subjectId,
      topicId: topic.id,
      title: topic.title
    });
  };

  const handleSaveTopicEdit = () => {
    if (!editingTopic) return;

    dispatch({
      type: 'EDIT_TOPIC',
      subjectId: editingTopic.subjectId,
      topicId: editingTopic.topicId,
      title: editingTopic.title
    });

    setEditingTopic(null);
  };

  const handleEditSubtopic = (subjectId: string, topicId: string, subtopic: SubTopic) => {
    setEditingSubtopic({
      subjectId,
      topicId,
      subtopicId: subtopic.id,
      title: subtopic.title
    });
  };

  const handleSaveSubtopicEdit = () => {
    if (!editingSubtopic) return;

    dispatch({
      type: 'EDIT_SUBTOPIC',
      subjectId: editingSubtopic.subjectId,
      topicId: editingSubtopic.topicId,
      subtopicId: editingSubtopic.subtopicId,
      title: editingSubtopic.title
    });

    setEditingSubtopic(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Subjects</h2>
        <button
          className={`flex items-center px-4 py-2 rounded-lg ${
            theme.mode === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          onClick={() => setIsAddingSubject(true)}
        >
          <Plus size={20} className="mr-2" />
          Add Subject
        </button>
      </div>

      {isAddingSubject && (
        <div className={`p-6 rounded-lg mb-6 ${
          theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-md border ${
          theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className="text-lg font-medium mb-4">Add New Subject</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject Title</label>
              <input
                type="text"
                value={newSubjectTitle}
                onChange={(e) => setNewSubjectTitle(e.target.value)}
                placeholder="Enter subject title"
                className={`w-full p-2 border rounded ${
                  theme.mode === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newSubjectDescription}
                onChange={(e) => setNewSubjectDescription(e.target.value)}
                placeholder="Enter subject description"
                rows={3}
                className={`w-full p-2 border rounded ${
                  theme.mode === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                onClick={() => {
                  setIsAddingSubject(false);
                  setNewSubjectTitle('');
                  setNewSubjectDescription('');
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleAddSubject}
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {state.subjects.map((subject) => {
        const IconComponent = (LucideIcons[subject.icon as keyof typeof LucideIcons] as React.ComponentType<{ size: number }>) || LucideIcons.Book;
        const isEditing = editingSubject?.id === subject.id;
        
        return (
          <div
            key={subject.id}
            className={`rounded-lg ${
              theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-md overflow-hidden border ${
              theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div 
              className={`p-4 cursor-pointer ${
                theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
              onClick={() => !isEditing && toggleSubjectExpand(subject.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className={`p-2 rounded-full mr-3 ${
                    theme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <IconComponent size={20} />
                  </div>
                  {isEditing ? (
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editingSubject.title}
                        onChange={(e) => setEditingSubject(prev => prev ? { ...prev, title: e.target.value } : null)}
                        className={`w-full p-2 text-lg font-medium border rounded ${
                          theme.mode === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <textarea
                        value={editingSubject.description}
                        onChange={(e) => setEditingSubject(prev => prev ? { ...prev, description: e.target.value } : null)}
                        rows={2}
                        className={`w-full p-2 border rounded ${
                          theme.mode === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={handleSaveSubjectEdit}
                        >
                          Save
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          onClick={() => setEditingSubject(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{subject.title}</h3>
                      <p className={`text-sm ${
                        theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {subject.description}
                      </p>
                    </div>
                  )}
                </div>
                {!isEditing && (
                  <div className="flex items-center space-x-2">
                    <button
                      className={`p-2 rounded ${
                        theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleEditSubject(subject)}
                      title="Edit subject"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className={`p-2 rounded text-red-500 ${
                        theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this subject?')) {
                          dispatch({
                            type: 'REMOVE_SUBJECT',
                            subjectId: subject.id
                          });
                        }
                      }}
                      title="Delete subject"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="text-sm font-medium">{getCompletionPercentage(subject.id)}%</div>
                  </div>
                )}
              </div>
            </div>

            {expandedSubjects[subject.id] && (
              <div className="p-4 border-t dark:border-gray-700">
                <ul className="space-y-3">
                  {subject.topics.map((topic) => {
                    const isEditingTopic = editingTopic?.topicId === topic.id;
                    
                    return (
                      <li key={topic.id}>
                        <div className="flex items-start">
                          <button
                            className="mt-1 mr-2"
                            onClick={() => handleToggleTopicCompletion(subject.id, topic.id)}
                          >
                            {topic.completed ? (
                              <CheckCircle size={18} className="text-green-500" />
                            ) : (
                              <Circle size={18} className="text-gray-400" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              {isEditingTopic ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={editingTopic.title}
                                    onChange={(e) => setEditingTopic(prev => prev ? { ...prev, title: e.target.value } : null)}
                                    className={`flex-1 p-1 border rounded ${
                                      theme.mode === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                    autoFocus
                                  />
                                  <button
                                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={handleSaveTopicEdit}
                                  >
                                    <LucideIcons.Check size={14} />
                                  </button>
                                  <button
                                    className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    onClick={() => setEditingTopic(null)}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div
                                  className={`flex items-center cursor-pointer ${
                                    topic.completed ? 'line-through text-gray-400' : ''
                                  }`}
                                  onClick={() => toggleTopicExpand(topic.id)}
                                >
                                  <span className="mr-2">{topic.title}</span>
                                  {expandedTopics[topic.id] ? (
                                    <ChevronDown size={16} />
                                  ) : (
                                    <ChevronRight size={16} />
                                  )}
                                </div>
                              )}
                              {!isEditingTopic && (
                                <div className="flex items-center space-x-2">
                                  <button
                                    className={`p-1 rounded ${
                                      theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                    }`}
                                    onClick={() => handleEditTopic(subject.id, topic)}
                                    title="Edit topic"
                                  >
                                    <LucideIcons.Edit size={14} />
                                  </button>
                                  <button
                                    className={`p-1 rounded ${
                                      theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                    }`}
                                    onClick={() => {
                                      setAddingSubtopicForTopic({
                                        subjectId: subject.id,
                                        topicId: topic.id,
                                      });
                                      setExpandedTopics((prev) => ({
                                        ...prev,
                                        [topic.id]: true,
                                      }));
                                    }}
                                    title="Add subtopic"
                                  >
                                    <Plus size={14} />
                                  </button>
                                  <button
                                    className={`p-1 rounded ${
                                      theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                    }`}
                                    onClick={() => handleRemoveTopic(subject.id, topic.id)}
                                    title="Remove topic"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </div>

                            {expandedTopics[topic.id] && (
                              <ul className="mt-2 pl-6 space-y-2">
                                {topic.subtopics.map((subtopic) => {
                                  const isEditingSubtopic = editingSubtopic?.subtopicId === subtopic.id;
                                  
                                  return (
                                    <li key={subtopic.id} className="flex items-start group">
                                      <button
                                        className="mr-2 mt-0.5"
                                        onClick={() =>
                                          handleToggleSubtopicCompletion(
                                            subject.id,
                                            topic.id,
                                            subtopic.id
                                          )
                                        }
                                      >
                                        {subtopic.completed ? (
                                          <CheckCircle size={16} className="text-green-500" />
                                        ) : (
                                          <Circle size={16} className="text-gray-400" />
                                        )}
                                      </button>
                                      {isEditingSubtopic ? (
                                        <div className="flex items-center flex-1 space-x-2">
                                          <input
                                            type="text"
                                            value={editingSubtopic.title}
                                            onChange={(e) => setEditingSubtopic(prev => prev ? { ...prev, title: e.target.value } : null)}
                                            className={`flex-1 p-1 text-sm border rounded ${
                                              theme.mode === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                            autoFocus
                                          />
                                          <button
                                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            onClick={handleSaveSubtopicEdit}
                                          >
                                            <LucideIcons.Check size={14} />
                                          </button>
                                          <button
                                            className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                            onClick={() => setEditingSubtopic(null)}
                                          >
                                            <X size={14} />
                                          </button>
                                        </div>
                                      ) : (
                                        <>
                                          <span className={`flex-1 ${subtopic.completed ? 'line-through text-gray-400' : ''}`}>
                                            {subtopic.url ? (
                                              <a 
                                                href={subtopic.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-500 hover:underline"
                                              >
                                                {subtopic.title}
                                              </a>
                                            ) : (
                                              subtopic.title
                                            )}
                                          </span>
                                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                                            <button
                                              className={`p-1 rounded ${
                                                theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                              }`}
                                              onClick={() => handleEditSubtopic(subject.id, topic.id, subtopic)}
                                              title="Edit subtopic"
                                            >
                                              <LucideIcons.Edit size={14} />
                                            </button>
                                            <button
                                              className={`p-1 rounded ${
                                                theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                              }`}
                                              onClick={() =>
                                                handleRemoveSubtopic(subject.id, topic.id, subtopic.id)
                                              }
                                              title="Remove subtopic"
                                            >
                                              <Trash2 size={14} />
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </li>
                                  );
                                })}
                                
                                {addingSubtopicForTopic?.subjectId === subject.id &&
                                  addingSubtopicForTopic?.topicId === topic.id && (
                                    <li className="flex items-center mt-2">
                                      <input
                                        type="text"
                                        value={newSubtopicTitle}
                                        onChange={(e) => setNewSubtopicTitle(e.target.value)}
                                        placeholder="New subtopic"
                                        className={`flex-1 p-1 text-sm border rounded ${
                                          theme.mode === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            handleAddSubtopic(subject.id, topic.id);
                                          }
                                        }}
                                        autoFocus
                                      />
                                      <button
                                        className="ml-2 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleAddSubtopic(subject.id, topic.id)}
                                      >
                                        <Plus size={16} />
                                      </button>
                                      <button
                                        className="ml-1 p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                        onClick={() => setAddingSubtopicForTopic(null)}
                                      >
                                        <X size={16} />
                                      </button>
                                    </li>
                                  )}
                              </ul>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4">
                  {addingTopicForSubject === subject.id ? (
                    <div className="flex items-center mt-2">
                      <input
                        type="text"
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        placeholder="New topic"
                        className={`flex-1 p-2 border rounded ${
                          theme.mode === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddTopic(subject.id);
                          }
                        }}
                      />
                      <button
                        className="ml-2 p-2 bg-blue-500 text-white rounded"
                        onClick={() => handleAddTopic(subject.id)}
                      >
                        Add
                      </button>
                      <button
                        className="ml-1 p-2 bg-gray-500 text-white rounded"
                        onClick={() => setAddingTopicForSubject(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className={`flex items-center p-2 rounded ${
                        theme.mode === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => setAddingTopicForSubject(subject.id)}
                    >
                      <Plus size={18} className="mr-2" />
                      <span>Add Topic</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SubjectList;
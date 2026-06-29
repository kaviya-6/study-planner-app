import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

export interface User {
  name: string;
  email: string;
  avatar?: string;
  streak: number;
  isAuthenticated: boolean;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  color: string;
  image: string;
  description: string;
  createdAt: string;
}

export interface Task {
  id: string;
  courseId: string;
  title: string;
  deadline: string;
  status: 'To Do' | 'In Progress' | 'Done';
}

export interface StudySession {
  id: string;
  courseId: string;
  courseTitle: string;
  duration: number; // in minutes
  date: string;
  focusType: 'Pomodoro' | 'Short Break' | 'Long Break';
}

interface PlannerContextType {
  user: User;
  courses: Course[];
  tasks: Task[];
  studySessions: StudySession[];
  authLoading: boolean;
  addCourse: (title: string, code: string, color: string, image: string, description: string) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addTask: (courseId: string, title: string, deadline: string) => Promise<void>;
  updateTaskStatus: (id: string, status: 'To Do' | 'In Progress' | 'Done') => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addStudySession: (courseId: string, duration: number, focusType: 'Pomodoro' | 'Short Break' | 'Long Break') => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

// Mappers to translate backend database syntax to local frontend interfaces
const mapCourse = (c: any): Course => ({
  id: c._id,
  title: c.title,
  code: c.code,
  color: c.color,
  image: c.image,
  description: c.description || '',
  createdAt: c.createdAt,
});

const mapTask = (t: any): Task => ({
  id: t._id,
  courseId: typeof t.course === 'object' ? t.course._id : t.course,
  title: t.title,
  deadline: t.deadline ? t.deadline.split('T')[0] : '',
  status: t.status,
});

const mapSession = (s: any): StudySession => ({
  id: s._id,
  courseId: typeof s.course === 'object' ? s.course._id : s.course,
  courseTitle: typeof s.course === 'object' ? s.course.title : 'General Study',
  duration: s.duration,
  date: s.date,
  focusType: s.focusType,
});

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    avatar: '',
    streak: 0,
    isAuthenticated: false,
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [authLoading, setAuthLoading] = useState(true);

  // Authenticate user on page load if token is found
  useEffect(() => {
    let cancelled = false;

    const verifyUserSession = async () => {
      const tokenAtStart = localStorage.getItem('sp_token');
      if (!tokenAtStart) {
        if (!cancelled) setAuthLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (cancelled) return;

        const dbUser = res.data.user;
        setUser({
          name: dbUser.name,
          email: dbUser.email,
          avatar: dbUser.avatar,
          streak: dbUser.streak,
          isAuthenticated: true,
        });

        await loadPlannerData();
      } catch (err) {
        if (cancelled) return;
        console.error('Session verification failed:', err);
        // Only clear session if the token wasn't replaced during login (avoids race)
        if (localStorage.getItem('sp_token') === tokenAtStart) {
          localStorage.removeItem('sp_token');
          setUser({
            name: '',
            email: '',
            avatar: '',
            streak: 0,
            isAuthenticated: false,
          });
          setCourses([]);
          setTasks([]);
          setStudySessions([]);
        }
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    };

    verifyUserSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadPlannerData = async () => {
    try {
      const [coursesRes, tasksRes, sessionsRes] = await Promise.all([
        api.get('/courses'),
        api.get('/tasks'),
        api.get('/study-sessions'),
      ]);

      setCourses(coursesRes.data.courses.map(mapCourse));
      setTasks(tasksRes.data.tasks.map(mapTask));
      setStudySessions(sessionsRes.data.sessions.map(mapSession));
    } catch (err) {
      console.error('Error fetching planner data from API:', err);
    }
  };

  const addCourse = async (title: string, code: string, color: string, image: string, description: string) => {
    try {
      const res = await api.post('/courses', { title, code, color, image, description });
      const newCourse = mapCourse(res.data.course);
      setCourses((prev) => [newCourse, ...prev]);
    } catch (error) {
      console.error('Failed to add course:', error);
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await api.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      // Cascade delete locally
      setTasks((prev) => prev.filter((t) => t.courseId !== id));
      setStudySessions((prev) => prev.filter((s) => s.courseId !== id));
    } catch (error) {
      console.error('Failed to delete course:', error);
      throw error;
    }
  };

  const addTask = async (courseId: string, title: string, deadline: string) => {
    try {
      const res = await api.post('/tasks', { courseId, title, deadline });
      const newTask = mapTask(res.data.task);
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const updateTaskStatus = async (id: string, status: 'To Do' | 'In Progress' | 'Done') => {
    try {
      const res = await api.put(`/tasks/${id}`, { status });
      const updated = mapTask(res.data.task);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (error) {
      console.error('Failed to update task status:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  const addStudySession = async (courseId: string, duration: number, focusType: 'Pomodoro' | 'Short Break' | 'Long Break') => {
    try {
      const res = await api.post('/study-sessions', { courseId, duration, focusType });
      const newSession = mapSession(res.data.session);
      setStudySessions((prev) => [newSession, ...prev]);
      
      // Update streak from verified profile status
      const profileRes = await api.get('/auth/me');
      setUser((prev) => ({
        ...prev,
        streak: profileRes.data.user.streak,
      }));
    } catch (error) {
      console.error('Failed to add study session:', error);
      throw error;
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: dbUser } = res.data;

      localStorage.setItem('sp_token', token);
      setUser({
        name: dbUser.name,
        email: dbUser.email,
        avatar: dbUser.avatar,
        streak: dbUser.streak,
        isAuthenticated: true,
      });

      // Fetch data associated with newly logged user
      // Token is set synchronously in localStorage so loadPlannerData headers resolve
      await loadPlannerData();
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token, user: dbUser } = res.data;

      localStorage.setItem('sp_token', token);
      setUser({
        name: dbUser.name,
        email: dbUser.email,
        avatar: dbUser.avatar,
        streak: dbUser.streak,
        isAuthenticated: true,
      });

      // Clear local records for fresh registrant
      setCourses([]);
      setTasks([]);
      setStudySessions([]);
    } catch (error) {
      console.error('Registration request failed:', error);
      throw error;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('sp_token');
    setUser({
      name: '',
      email: '',
      avatar: '',
      streak: 0,
      isAuthenticated: false,
    });
    setCourses([]);
    setTasks([]);
    setStudySessions([]);
  };

  return (
    <PlannerContext.Provider
      value={{
        user,
        courses,
        tasks,
        studySessions,
        authLoading,
        addCourse,
        deleteCourse,
        addTask,
        updateTaskStatus,
        deleteTask,
        addStudySession,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};

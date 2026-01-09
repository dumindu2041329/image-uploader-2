/**
 * ⚠️ DEMO-ONLY AUTHENTICATION SYSTEM ⚠️
 * 
 * This is a client-side only authentication system using localStorage.
 * It is NOT SECURE and should NEVER be used in production.
 * 
 * Security issues:
 * - Passwords are hashed client-side only (server should hash)
 * - Data stored in localStorage is accessible via JavaScript
 * - No rate limiting, CSRF protection, or secure session management
 * - Sessions never expire
 * - Vulnerable to XSS attacks
 * 
 * Use only for demos, prototypes, and learning purposes.
 */

const USERS_KEY = "iu_users";
const SESSION_KEY = "iu_session";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatarDataUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  avatarDataUrl?: string;
  bio?: string;
  createdAt: string;
}

// Utility to hash passwords using SHA-256
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Get all users from localStorage
function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

// Save users to localStorage
function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get current session
function getStoredSession(): Session | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

// Save session
function saveSession(session: Session | null): void {
  if (typeof window === "undefined") return;
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// Convert User to PublicUser (remove sensitive data)
function toPublicUser(user: User): PublicUser {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<{ success: true; user: PublicUser } | { success: false; error: string }> {
  try {
    const users = getUsers();
    
    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return { success: false, error: "Email already registered" };
    }
    
    // Create new user
    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash,
      name,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Create session
    const session: Session = {
      userId: newUser.id,
      createdAt: new Date().toISOString(),
    };
    saveSession(session);
    
    return { success: true, user: toPublicUser(newUser) };
  } catch (error) {
    return { success: false, error: "Failed to sign up" };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<{ success: true; user: PublicUser } | { success: false; error: string }> {
  try {
    const users = getUsers();
    const passwordHash = await hashPassword(password);
    
    const user = users.find((u) => u.email === email && u.passwordHash === passwordHash);
    
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }
    
    // Create session
    const session: Session = {
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    saveSession(session);
    
    return { success: true, user: toPublicUser(user) };
  } catch (error) {
    return { success: false, error: "Failed to sign in" };
  }
}

export function signOut(): void {
  saveSession(null);
}

export function getSession(): Session | null {
  return getStoredSession();
}

export function getCurrentUser(): PublicUser | null {
  const session = getStoredSession();
  if (!session) return null;
  
  const users = getUsers();
  const user = users.find((u) => u.id === session.userId);
  
  return user ? toPublicUser(user) : null;
}

export async function updateProfile(
  updates: Partial<Pick<User, "name" | "avatarDataUrl" | "bio">>
): Promise<{ success: true; user: PublicUser } | { success: false; error: string }> {
  try {
    const session = getStoredSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }
    
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === session.userId);
    
    if (userIndex === -1) {
      return { success: false, error: "User not found" };
    }
    
    // Update user
    users[userIndex] = { ...users[userIndex], ...updates };
    saveUsers(users);
    
    return { success: true, user: toPublicUser(users[userIndex]) };
  } catch (error) {
    return { success: false, error: "Failed to update profile" };
  }
}

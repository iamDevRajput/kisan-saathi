import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Mock user database - Replace with Prisma in production
const users = [
  {
    id: '1',
    email: 'admin@kisansaathi.com',
    password: '$2a$10$YourHashedPasswordHere', // bcrypt hash of 'password'
    name: 'Admin User',
    role: 'ADMIN' as const,
    image: null,
  },
  {
    id: '2',
    email: 'farmer@example.com',
    password: '$2a$10$YourHashedPasswordHere',
    name: 'Ram Singh',
    role: 'FARMER' as const,
    image: null,
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = users.find((u) => u.email === credentials.email);

        if (!user) {
          return null;
        }

        // In production, use bcrypt.compare
        // const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        const isPasswordValid = credentials.password === 'password'; // Demo only

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
};

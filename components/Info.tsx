// components/Info.tsx
export default function Info() {
    return (
      <div className="max-w-lg mx-auto mb-6 rounded-lg bg-indigo-50 border border-indigo-200 p-4 text-sm text-indigo-900 flex items-start gap-3 shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 mt-1 text-indigo-500 flex-shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M12 20.25a8.25 8.25 0 110-16.5 8.25 8.25 0 010 16.5z"
          />
        </svg>
  
        <div>
          <p>
            This project has a minimal UI and is focused solely on implementing <span className="font-semibold">NextAuth</span> correctly.
          </p>
          <p className="mt-2">
            You can register, log in with email, or use GitHub authentication. It’s a full-stack demo with user data stored in <span className="font-semibold">MongoDB</span> using <span className="font-semibold">Prisma ORM</span>.
          </p>
        </div>
      </div>
    );
  }
  
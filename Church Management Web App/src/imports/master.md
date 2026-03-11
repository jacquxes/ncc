# master.md
Church Management Platform  
Design System, Engineering Standards & Feature Architecture

Version: 1.0

---

# 1. Technology Stack

## Frontend

Language: TypeScript  
Framework: Next.js (React)  
Styling: Tailwind CSS  
State Management: TanStack Query  
Forms: React Hook Form  
Icons: Lucide Icons  

## Backend

Language: TypeScript  
Framework: NestJS (Node.js)  
API: REST API  
Database: PostgreSQL  
ORM: Prisma  

---

# 2. Design Tokens

## Color Palette

### Primary

- primary-50: #f0f9ff
- primary-100: #e0f2fe
- primary-200: #bae6fd
- primary-300: #7dd3fc
- primary-400: #38bdf8
- primary-500: #0ea5e9
- primary-600: #0284c7
- primary-700: #0369a1
- primary-800: #075985
- primary-900: #0c4a6e

### Neutral

- gray-50: #f9fafb
- gray-100: #f3f4f6
- gray-200: #e5e7eb
- gray-300: #d1d5db
- gray-400: #9ca3af
- gray-500: #6b7280
- gray-600: #4b5563
- gray-700: #374151
- gray-800: #1f2937
- gray-900: #111827

### Semantic Colors

- success: #22c55e
- warning: #f59e0b
- danger: #ef4444
- info: #3b82f6
- sensitive: #8b5cf6

---

# 3. Typography

Primary font:

Inter, system-ui, sans-serif

## Font Sizes

- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px

## Font Weights

- 400 regular
- 500 medium
- 600 semibold
- 700 bold

---

# 4. Tailwind Configuration Example

// tailwind.config.js

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e"
        }
      }
    }
  }
}

---

# 5. Component Architecture
All reusable components must live under:

/components/ui

Components must:

- be written in TypeScript
- use Tailwind utility classes
- be reusable
- follow consistent props patterns

## Button component

type ButtonProps = {
  variant?: "primary" | "secondary" | "danger"
  children: React.ReactNode
}

export function Button({ variant = "primary", children }: ButtonProps) {

  const styles = {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600"
  }

  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition ${styles[variant]}`}
    >
      {children}
    </button>
  )
}

## Card component

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {children}
    </div>
  )
}

### Subcomponents

export function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 font-semibold text-gray-800">
      {children}
    </div>
  )
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-gray-600">
      {children}
    </div>
  )
}

## Input component

type InputProps = {
  label: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">

      <label className="text-sm text-gray-600">
        {label}
      </label>

      <input
        {...props}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary-500"
      />

      {error && (
        <span className="text-sm text-red-500">
          {error}
        </span>
      )}

    </div>
  )
}

## Modal component

type ModalProps = {
  open: boolean
  children: React.ReactNode
}

export function Modal({ open, children }: ModalProps) {

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white rounded-lg shadow-lg w-[500px] p-6">

        {children}

      </div>

    </div>
  )
}

## Timeline component (pastoral history)

type TimelineItem = {
  title: string
  date: string
  description: string
}

export function Timeline({ items }: { items: TimelineItem[] }) {

  return (

    <div className="flex flex-col gap-4">

      {items.map((item, index) => (

        <div key={index} className="flex gap-3">

          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>

          <div>

            <div className="text-sm font-semibold">
              {item.title}
            </div>

            <div className="text-xs text-gray-400">
              {item.date}
            </div>

            <div className="text-sm text-gray-600">
              {item.description}
            </div>

          </div>

        </div>

      ))}

    </div>

  )
}

## Member card component

type Member = {
  name: string
  email: string
  careStatus: string
}

export function MemberCard({ member }: { member: Member }) {

  return (

    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">

      <div className="font-semibold text-lg">
        {member.name}
      </div>

      <div className="text-sm text-gray-500">
        {member.email}
      </div>

      <div className="mt-2 text-xs px-2 py-1 inline-block rounded bg-blue-100 text-blue-700">
        {member.careStatus}
      </div>

    </div>

  )
}

# 6. Feature Modules

## Pastoral Care Case Management
Purpose:
Track pastoral support cases for church members.

Data Fields
- id
- member_id
- case_type
- assigned_pastor_id
- status
- confidentiality_level
- created_at
- updated_at

Case Status
- identified
- assigned
- active
- monitoring
- closed

Example Case Types
- grief
- marriage
- health
- financial
- spiritual guidance

## Campaign Management
Used to coordinate church initiatives.

Campaign Fields
- id
- name
- description
- start_date
- end_date
- target_audience
- status

Campaign Status
- draft
- active
- completed
- archived

# 7. Permissions System

## Role Based Access Control (RBAC)

Roles:
- Admin
- Pastor
- Care Team
- Ministry Leader
- Volunteer

Permissions must be enforced in:
- frontend UI
- backend API

# 8. Accessibility

All UI components must comply with:
- WCAG 2.1 AA

Requirements:
- keyboard navigation

ARIA attributes
- accessible labels
- color contrast compliance

# 9. Development Workflow

Branch Strategy
- main
- develop
- feature/*
- fix/*

Commit Prefix
- feat:
- fix:
- refactor:
- docs:

Example:
- feat: add pastoral care timeline component
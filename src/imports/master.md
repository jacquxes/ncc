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
- new
- assigned
- scheduled
- completed

Case Types
- grief and bereavement 
- illness and hospital visitation
- marriage and relationship issues
- family and parenting struggles
- spiritual crisis or faith struggles
- financial or life crisis
- crisis and trauma care

## Giving
View and track offerings from members.

Categories
- general offering
- designated offering (israel)
- designated offering (outreach)
- designated offering (global missions)
- designated offering (others)

Transactions
- member id
- member name
- phone number
- amount (Formatted as currency)
- paynow id (Reference number)
- transaction datetime (Formatted as DD/MM/YYYY HH:mm)
- category
- active
- completed
- archived

# 7. Permissions System

## Role Based Access Control (RBAC)

The system must enforce role-based permissions at both the frontend and backend layers.  
Frontend controls are for usability only. Backend authorization is the source of truth and must validate every protected action.

## Access Control Principles

- every authenticated user must have exactly one system role at minimum
- permissions must be enforced per action, not only per page
- sensitive pastoral and member data must be filtered server-side based on role
- users must never be able to access unauthorized records by URL, API call, or modified client request
- audit logging must capture access and updates to sensitive records

## Roles

### Staff

Staff users have operational ownership across the platform.

Permissions:
- full read access to all member, campaign, and pastoral care records
- full write access to editable records
- can create, edit, assign, reassign, and close pastoral care cases
- can create and manage campaigns
- can view all data across the system

Typical use cases:
- assign a case to a pastor
- update member records
- manage campaign setup and reporting
- review all active and closed cases

### Pastor

Pastor users have limited access scoped to their assigned pastoral work.

Permissions:
- read-only access to assigned cases only
- cannot view unassigned cases or cases assigned to other pastors
- can update case status
- can add and edit notes on assigned cases
- cannot reassign cases
- cannot edit member master data unless explicitly granted in a future permission extension

Typical use cases:
- review assigned pastoral care cases
- add follow-up notes after a call or visit
- move a case from active to monitoring or closed

## Permission Matrix

| Resource / Action | Staff | Pastor |
|---|---|---|
| View all members | Yes | No |
| Edit member records | Yes | No |
| View all care cases | Yes | No |
| View assigned care cases | Yes | Yes |
| Create care case | Yes | No |
| Assign / reassign care case | Yes | No |
| Update case status | Yes | Yes, assigned only |
| Add case notes | Yes | Yes, assigned only |
| Edit existing case notes | Yes | Yes, assigned only |
| Close case | Yes | Yes, assigned only |
| View all campaigns | Yes | No |
| Create / edit campaigns | Yes | No |
| View reporting dashboard | Yes | Limited to assigned workload only, if implemented |

## Authorization Rules

### Staff
A user with the `staff` role may:
- perform all read and write actions
- assign any case to any eligible pastor
- view all member, case, and campaign data

### Pastor
A user with the `pastor` role may:
- access only care cases where `assigned_pastor_id = current_user.id`
- read assigned case details
- update only:
  - `status`
  - `notes`
  - `updated_at` via system action
- not modify:
  - assignee
  - member identity fields
  - confidentiality level
  - campaign records

## Backend Enforcement

RBAC must be enforced in API and service layers.

Example guard logic:
- check authenticated user role
- check target resource ownership or assignment
- reject unauthorized access with `403 Forbidden`
- return `404 Not Found` for resources that should not be discoverable, where appropriate

Example policy rules:

```ts
type Role = "staff" | "pastor";

function canViewCase(user: { id: string; role: Role }, caseRecord: { assigned_pastor_id: string }) {
  if (user.role === "staff") return true;
  if (user.role === "pastor" && caseRecord.assigned_pastor_id === user.id) return true;
  return false;
}

function canUpdateCase(user: { id: string; role: Role }, caseRecord: { assigned_pastor_id: string }) {
  if (user.role === "staff") return true;
  if (user.role === "pastor" && caseRecord.assigned_pastor_id === user.id) return true;
  return false;
}
```

## Frontend Behaviour

UI must reflect permissions clearly.

### Staff UI
- show full navigation
- show assign and edit controls
- show all records in list and dashboard views

### Pastor UI
- show assigned cases only
- hide assignment controls
- disable or hide unauthorized edit actions
- expose only status and notes update controls on case detail pages

Important:
- hidden UI elements do not replace backend authorization
- frontend state must be derived from backend permission responses where possible

## Audit and Logging

The system must log the following RBAC-sensitive events:
- case assignment
- reassignment
- status change
- note creation
- note edit
- unauthorized access attempts
- viewing of sensitive pastoral records, if audit policy requires it

Minimum audit fields:
- actor_user_id
- actor_role
- action
- resource_type
- resource_id
- timestamp

## Future Extension

The RBAC model should be extensible to support additional roles later, such as:
- admin
- care team
- ministry leader
- volunteer

The permission model should be implemented using policy-based authorization or a centralized permission map to avoid hardcoding role checks throughout the codebase.

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

# 10. Responsive Design

All screens must be designed and implemented mobile-first.

## Breakpoints

The application must support the following responsive breakpoints:

- Mobile: < 480px
- Tablet: >= 480px and < 768px
- Desktop: >= 1024px

Note:
- The range between 768px and 1023px may be treated as small laptop / landscape tablet depending on layout needs.
- New components must define intended behaviour across all supported breakpoints before development starts.

## Layout Logic

Responsive layouts must use fluid sizing wherever possible.

Rules:
- use `%` for width-based layout sizing
- use `rem` for spacing, padding, margin, typography, and sizing
- avoid fixed `px` widths for containers, cards, modals, and form layouts unless strictly necessary
- use `max-width` instead of hard width constraints where possible
- use `min-width` only when required to preserve usability

Preferred examples:
- `w-full`
- `max-w-screen-lg`
- `max-w-[32rem]`
- `p-4`
- `gap-4`
- `text-base`

Avoid:
- fixed card widths such as `w-[400px]`
- fixed modal widths that overflow on mobile
- dense multi-column layouts on tablet and below

## Grid and Layout Behaviour

### Mobile (< 480px)
- default to single-column layouts
- stack cards, inputs, filters, and actions vertically
- tables should collapse into card or list patterns when readability is affected
- sidebars should become drawers, bottom sheets, or hidden navigation
- primary actions should remain visible without horizontal scrolling

### Tablet (< 768px)
- support one-column or two-column layouts depending on content density
- allow summary panels to move below main content
- preserve clear spacing between cards and sections
- avoid more than 2 columns for content-heavy screens

### Desktop (> 1024px)
- allow multi-column layouts for dashboards, member profiles, and case management screens
- use persistent sidebar navigation where applicable
- allow supporting panels such as activity timeline, notes, and detail panes to appear side-by-side
- keep line length readable by constraining content width

## Component Responsiveness

All reusable components must define:
- stacking behaviour
- width behaviour
- overflow behaviour
- interaction pattern on touch devices

Examples:
- Button groups must stack vertically on mobile when horizontal space is limited
- Modals must switch to near-full-width on mobile, using safe viewport padding
- Data tables must support horizontal scroll or responsive transformation into cards
- Form rows with multiple inputs must collapse into a single column on smaller screens

## Tailwind Responsive Guidance

Use Tailwind responsive utilities consistently.

Examples:

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
  {children}
</div>
```

```tsx
<div className="w-full max-w-[32rem] rounded-lg bg-white p-4 md:p-6">
  {children}
</div>
```

```tsx
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  {children}
</div>
```

## Responsive QA Requirements

Before release, each screen must be verified for:
- no horizontal overflow on mobile
- readable typography at all supported breakpoints
- touch-friendly tap targets
- correct stacking order of cards and actions
- accessible navigation on smaller screens
- usable forms without zoom dependency
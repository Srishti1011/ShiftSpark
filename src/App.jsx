import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Camera,
  CheckCheck,
  CircleUserRound,
  Clock3,
  Compass,
  Filter,
  HeartHandshake,
  Home,
  LayoutGrid,
  MapPin,
  MessageSquareText,
  Palette,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'shiftspark-demo-state'

const categoryMeta = [
  { key: 'All', label: 'All', icon: LayoutGrid },
  { key: 'Event Management', label: 'Event Management', icon: CalendarDays },
  { key: 'Design & Creativity', label: 'Design & Creativity', icon: Palette },
  { key: 'Photography & Media', label: 'Photography & Media', icon: Camera },
  { key: 'Technical Support', label: 'Technical Support', icon: ShieldCheck },
  { key: 'Social Outreach', label: 'Social Outreach', icon: HeartHandshake },
  { key: 'Logistics', label: 'Logistics', icon: BriefcaseBusiness },
  { key: 'Hospitality', label: 'Hospitality', icon: Sparkles },
  { key: 'Marketing & Promotion', label: 'Marketing & Promotion', icon: Star },
]

const eventData = [
  { id: 'campus-fest', title: 'Campus Fest 2026', organizer: 'Student Life Council', category: 'Event Management', date: 'Apr 12, 2026', time: '09:00 - 17:00', location: 'Main Quad', spots: 12, image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80', summary: 'Help welcome students, run stalls, and orchestrate performances.' },
  { id: 'hackowasp', title: 'HackOWASP 8.0', organizer: 'OWASP Chapter', category: 'Technical Support', date: 'Mar 28, 2026', time: '08:30 - 18:00', location: 'Innovation Lab', spots: 16, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80', summary: 'Manage check-ins, debug rooms, and support student developers.' },
  { id: 'blood-drive', title: 'Blood Donation Drive', organizer: 'Health & Wellness Cell', category: 'Social Outreach', date: 'Feb 18, 2026', time: '10:00 - 15:00', location: 'Student Union Hall', spots: 8, image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=900&q=80', summary: 'Support outreach, donor flow, and friendly campus mobilization.' },
  { id: 'photo-exhibition', title: 'Photography Exhibition', organizer: 'Visual Arts Society', category: 'Photography & Media', date: 'May 02, 2026', time: '11:00 - 16:30', location: 'Atrium Gallery', spots: 7, image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80', summary: 'Capture community moments and support the event doc team.' },
  { id: 'cultural-night', title: 'Cultural Night', organizer: 'Diversity Collective', category: 'Hospitality', date: 'Apr 24, 2026', time: '18:30 - 22:30', location: 'Open Air Theatre', spots: 14, image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80', summary: 'Host guests, manage stage needs, and spark a welcoming vibe.' },
  { id: 'robotics-workshop', title: 'Robotics Workshop', organizer: 'STEM Guild', category: 'Technical Support', date: 'Mar 09, 2026', time: '13:00 - 17:00', location: 'Maker Studio', spots: 9, image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80', summary: 'Set up equipment, guide attendees, and keep demos moving.' },
  { id: 'sports-meet', title: 'Inter-College Sports Meet', organizer: 'Sports Board', category: 'Logistics', date: 'Apr 30, 2026', time: '08:00 - 18:00', location: 'North Field', spots: 18, image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80', summary: 'Coordinate venue flow, check-in teams, and assist match operations.' },
  { id: 'clean-drive', title: 'Community Clean-Up Drive', organizer: 'Green Campus Network', category: 'Social Outreach', date: 'Feb 28, 2026', time: '08:30 - 12:30', location: 'Riverfront Park', spots: 20, image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80', summary: 'Drive awareness, handle logistics, and keep volunteers moving.' },
]

const storyData = [
  { name: 'Ava', role: 'Volunteer, Design Crew', quote: 'I found my people and gained real confidence leading creative projects.' },
  { name: 'Milo', role: 'Event Ops Lead', quote: 'ShiftSpark made event volunteering feel organized, energizing, and truly social.' },
  { name: 'Priya', role: 'Community Outreach', quote: 'The platform helped me turn curiosity into action and find opportunities that mattered.' },
]

const volunteerLinks = [
  { label: 'Home', to: '/volunteer/home', icon: Home },
  { label: 'Explore', to: '/volunteer/explore', icon: Compass },
  { label: 'My Shifts', to: '/volunteer/my-shifts', icon: CalendarDays },
  { label: 'Community', to: '/volunteer/community', icon: Users },
  { label: 'Profile', to: '/volunteer/profile', icon: CircleUserRound },
]

const organiserLinks = [
  { label: 'Overview', to: '/organiser/overview', icon: LayoutGrid },
  { label: 'Events', to: '/organiser/events', icon: CalendarDays },
  { label: 'Volunteer Applications', to: '/organiser/applications', icon: BellRing },
  { label: 'Shift Planner', to: '/organiser/shift-planner', icon: Clock3 },
  { label: 'Team', to: '/organiser/team', icon: Users },
  { label: 'Analytics', to: '/organiser/analytics', icon: BarChart3 },
]

const defaultState = { role: 'volunteer', selectedCategory: 'All', appliedEventIds: ['blood-drive'] }

function getStoredState() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultState
  try {
    const parsed = JSON.parse(raw)
    return { ...defaultState, ...parsed }
  } catch {
    return defaultState
  }
}

function App() {
  const [state, setState] = useState(getStoredState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const applyToEvent = (eventId) => {
    setState((prev) => {
      const alreadyApplied = prev.appliedEventIds.includes(eventId)
      return {
        ...prev,
        appliedEventIds: alreadyApplied ? prev.appliedEventIds.filter((id) => id !== eventId) : [eventId, ...prev.appliedEventIds],
      }
    })
  }

  const setCategory = (category) => {
    setState((prev) => ({ ...prev, selectedCategory: category }))
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage state={state} setCategory={setCategory} applyToEvent={applyToEvent} setRole={(role) => setState((prev) => ({ ...prev, role }))} />} />
        <Route path="/volunteer/*" element={<VolunteerApp state={state} setRole={(role) => setState((prev) => ({ ...prev, role }))} setCategory={setCategory} applyToEvent={applyToEvent} />} />
        <Route path="/organiser/*" element={<OrganizerApp setRole={(role) => setState((prev) => ({ ...prev, role }))} />} />
      </Routes>
    </BrowserRouter>
  )
}

function LandingPage({ state, setRole, setCategory, applyToEvent }) {
  const navigate = useNavigate()
  const visibleEvents = useMemo(() => {
    const selected = state.selectedCategory === 'All' ? eventData : eventData.filter((event) => event.category === state.selectedCategory)
    return selected.slice(0, 4)
  }, [state.selectedCategory])

  return (
    <div className="app-shell">
      <header className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="surface-card flex items-center justify-between rounded-full px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5C3A5] text-lg font-black text-[#572D20]">S</div>
            <div className="brand-mark text-[#572D20]">ShiftSpark</div>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Link to="/" className="font-bold text-[#572D20]">Home</Link>
            <Link to="/volunteer/explore" className="font-bold text-[#8B756C]">Explore</Link>
            <Link to="/volunteer/my-shifts" className="font-bold text-[#8B756C]">My Shifts</Link>
            <Link to="/organiser/overview" className="font-bold text-[#8B756C]">Organiser</Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="role-switch hidden sm:flex">
              <button className={state.role === 'volunteer' ? 'active' : ''} onClick={() => setRole('volunteer')}>Volunteer</button>
              <button className={state.role === 'organiser' ? 'active' : ''} onClick={() => setRole('organiser')}>Organiser</button>
            </div>
            <button className="primary-button hidden sm:inline-flex" onClick={() => navigate('/volunteer/explore')}>
              Join now <ArrowRight size={16} />
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 pb-16 lg:grid-cols-[1.08fr_0.92fr] lg:pb-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#FBE0D0] px-3 py-2 text-sm font-extrabold text-[#572D20]">
              <Sparkles size={16} /> Campus volunteering made social
            </div>
            <h1 className="display-font max-w-xl text-5xl font-black leading-[0.96] text-[#572D20] sm:text-6xl">Good things happen when we show up.</h1>
            <p className="mt-5 max-w-lg text-lg text-[#8B756C]">Find meaningful ways to volunteer, meet people who care and help bring campus events to life.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="primary-button" onClick={() => navigate('/volunteer/explore')}>Explore Opportunities <ArrowRight size={16} /></button>
              <button className="secondary-button" onClick={() => navigate('/organiser/overview')}>Organise an Event</button>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-extrabold text-[#572D20]">
              <div className="metric-panel px-4 py-3"><div className="text-2xl text-[#3286C7]">24</div><div>upcoming opportunities</div></div>
              <div className="metric-panel px-4 py-3"><div className="text-2xl text-[#F27A9B]">180+</div><div>student volunteers</div></div>
              <div className="metric-panel px-4 py-3"><div className="text-2xl text-[#572D20]">12</div><div>societies</div></div>
            </div>
          </div>

          <div className="hero-grid">
            <div className="spark-illustration">
              <div className="blob one" />
              <div className="blob two" />
              <div className="blob three" />
              <div className="figure-group">
                <div className="figure one"><div className="head" /><div className="body" /><div className="arm left" /><div className="arm right" /><div className="leg left" /><div className="leg right" /></div>
                <div className="figure two"><div className="head" /><div className="body" /><div className="arm left" /><div className="arm right" /><div className="leg left" /><div className="leg right" /></div>
                <div className="figure three"><div className="head" /><div className="body" /><div className="arm left" /><div className="arm right" /><div className="leg left" /><div className="leg right" /></div>
                <div className="figure four"><div className="head" /><div className="body" /><div className="arm left" /><div className="arm right" /><div className="leg left" /><div className="leg right" /></div>
              </div>
              <div className="float-card card-a"><div className="icon-wrap"><Users size={18} /></div><div><div className="text-xs uppercase tracking-[0.15em] text-[#8B756C]">Community</div><div className="text-sm">168 active helpers</div></div></div>
              <div className="float-card card-b"><div className="icon-wrap"><CheckCheck size={18} /></div><div><div className="text-xs uppercase tracking-[0.15em] text-[#8B756C]">This week</div><div className="text-sm">7 shifts filled</div></div></div>
              <div className="float-card card-c"><div className="icon-wrap"><Trophy size={18} /></div><div><div className="text-xs uppercase tracking-[0.15em] text-[#8B756C]">Impact</div><div className="text-sm">420 volunteer hours</div></div></div>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div><p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#8B756C]">Discover</p><h2 className="display-font text-3xl font-black text-[#572D20]">Find your kind of impact</h2></div>
            <button className="ghost-button">Browse all</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categoryMeta.filter((item) => item.key !== 'All').map((category) => {
              const Icon = category.icon
              return (
                <button key={category.key} className="category-card flex items-center gap-4 p-4 text-left hover:-translate-y-1 transition-transform" onClick={() => { setCategory(category.key); navigate('/volunteer/explore') }}>
                  <div className="category-icon"><Icon size={22} /></div>
                  <div><div className="font-extrabold text-[#572D20]">{category.label}</div><div className="text-sm text-[#8B756C]">Live opportunities</div></div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="pb-16">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div><p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#8B756C]">Open roles</p><h2 className="display-font text-3xl font-black text-[#572D20]">Upcoming opportunities</h2></div>
            <Link to="/volunteer/explore" className="text-sm font-extrabold text-[#3286C7]">View all</Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {visibleEvents.map((event) => (
              <EventCard key={event.id} event={event} isApplied={state.appliedEventIds.includes(event.id)} onApply={applyToEvent} />
            ))}
          </div>
        </section>

        <section className="pb-16">
          <div className="surface-card rounded-[32px] p-6 sm:p-10">
            <div className="mb-8"><p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#8B756C]">Why volunteer</p><h2 className="display-font text-3xl font-black text-[#572D20]">Make your campus brighter</h2></div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { title: 'Make a real difference', text: 'Create experiences students remember and support the causes your community loves.' },
                { title: 'Meet people and build connections', text: 'Volunteer with friends, new classmates, and creative people across campus.' },
                { title: 'Learn skills beyond the classroom', text: 'Build practical, people-first experience in event planning, media and coordination.' },
              ].map((item) => (
                <div key={item.title} className="soft-panel rounded-[28px] p-5">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5C3A5] text-[#572D20]"><HeartHandshake size={20} /></div>
                  <h3 className="mb-2 text-xl font-black text-[#572D20]">{item.title}</h3>
                  <p className="text-[#8B756C]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="mb-7"><p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#8B756C]">Community stories</p><h2 className="display-font text-3xl font-black text-[#572D20]">People who showed up</h2></div>
          <div className="grid gap-5 lg:grid-cols-3">
            {storyData.map((story) => (
              <div key={story.name} className="surface-card rounded-[28px] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FBE0D0] text-lg font-black text-[#572D20]">{story.name.charAt(0)}</div>
                    <div><div className="font-extrabold text-[#572D20]">{story.name}</div><div className="text-sm text-[#8B756C]">{story.role}</div></div>
                  </div>
                  <div className="text-[#F27A9B]"><Star size={20} fill="currentColor" /></div>
                </div>
                <p className="text-lg text-[#572D20]">“{story.quote}”</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-6">
          <div className="surface-card rounded-[32px] bg-[#FDE8E7] p-8 text-center sm:p-12">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#8B756C]">Next step</p>
            <h2 className="display-font mx-auto max-w-2xl text-4xl font-black text-[#572D20] sm:text-5xl">Your next great experience starts with showing up.</h2>
            <button className="primary-button mt-8" onClick={() => navigate('/volunteer/explore')}>Find Your First Shift</button>
          </div>
        </section>
      </main>
    </div>
  )
}

function VolunteerApp({ state, setRole, setCategory, applyToEvent }) {
  const appliedEvents = eventData.filter((event) => state.appliedEventIds.includes(event.id))

  return (
    <div className="app-shell app-shell-layout">
      <aside className="sidebar">
        <div className="px-3 pb-2"><div className="brand-mark text-[#572D20]">ShiftSpark</div></div>
        <div className="space-y-2">{volunteerLinks.map(({ label, to, icon: Icon }) => (
          <NavLink key={label} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{label}</span></NavLink>
        ))}</div>
        <div className="soft-panel mt-auto rounded-[24px] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.15em] text-[#8B756C]"><Trophy size={16} /> Impact</div>
          <div className="flex items-center gap-3"><div className="progress-ring" /><div><div className="text-2xl font-black text-[#572D20]">72%</div><div className="text-sm text-[#8B756C]">goal this term</div></div></div>
        </div>
      </aside>

      <div className="main-stage">
        <header className="topbar">
          <div className="flex items-center gap-3"><div className="rounded-full bg-[#FBE0D0] p-2 text-[#572D20]"><Search size={18} /></div><div className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8B756C]">Volunteer Hub</div></div>
          <div className="role-switch">
            <button className={state.role === 'volunteer' ? 'active' : ''} onClick={() => setRole('volunteer')}>Volunteer</button>
            <button className={state.role === 'organiser' ? 'active' : ''} onClick={() => setRole('organiser')}>Organiser</button>
          </div>
        </header>
        <div className="page-inner">
          <Routes>
            <Route index element={<VolunteerHome appliedEvents={appliedEvents} />} />
            <Route path="home" element={<VolunteerHome appliedEvents={appliedEvents} />} />
            <Route path="explore" element={<VolunteerExplore setCategory={setCategory} applyToEvent={applyToEvent} selectedCategory={state.selectedCategory} appliedIds={state.appliedEventIds} />} />
            <Route path="my-shifts" element={<MyShiftsPage events={appliedEvents} />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </div>

      <nav className="mobile-nav">{volunteerLinks.map(({ label, to, icon: Icon }) => (
        <NavLink key={label} to={to} className={({ isActive }) => (isActive ? 'active' : '')}><Icon size={18} /><span>{label}</span></NavLink>
      ))}</nav>
    </div>
  )
}

function VolunteerHome({ appliedEvents }) {
  const stats = [
    { label: 'Upcoming shifts', value: appliedEvents.length || 0 },
    { label: 'Volunteering hours', value: '18 hrs' },
    { label: 'Events participated', value: '9' },
    { label: 'Skills gained', value: '6' },
  ]
  const preview = appliedEvents.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="surface-card rounded-[30px] p-6 sm:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8B756C]">Welcome back</p><h1 className="display-font mt-2 text-4xl font-black text-[#572D20]">Hey, Alex! Ready to make an impact?</h1></div>
          <button className="primary-button"><Plus size={18} /> Add a new shift</button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{stats.map((item) => (
        <div key={item.label} className="metric-panel p-5"><div className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#8B756C]">{item.label}</div><div className="mt-3 text-3xl font-black text-[#572D20]">{item.value}</div></div>
      ))}</div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card rounded-[30px] p-6">
          <div className="mb-5 flex items-center justify-between"><h2 className="display-font text-2xl font-black text-[#572D20]">Upcoming shifts</h2><Link to="/volunteer/my-shifts" className="font-extrabold text-[#3286C7]">See all</Link></div>
          <div className="space-y-4">{preview.length ? preview.map((event) => (
            <div key={event.id} className="soft-panel flex flex-col gap-4 rounded-[24px] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div><div className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#8B756C]">{event.category}</div><div className="mt-1 text-xl font-black text-[#572D20]">{event.title}</div><div className="mt-2 flex flex-wrap gap-3 text-sm text-[#8B756C]"><span className="inline-flex items-center gap-1"><CalendarDays size={14} /> {event.date}</span><span className="inline-flex items-center gap-1"><MapPin size={14} /> {event.location}</span></div></div>
              <button className="ghost-button">View details</button>
            </div>
          )) : <div className="empty-state"><p className="text-lg font-extrabold text-[#572D20]">No shifts booked yet.</p><p className="mt-2 text-[#8B756C]">Pick a role that matches you and start your next volunteer streak.</p></div>}</div>
        </div>
        <div className="surface-card rounded-[30px] p-6"><h2 className="display-font text-2xl font-black text-[#572D20]">Quick wins</h2><div className="mt-5 space-y-4">{[
          { name: 'Design a welcome banner', tag: 'Creative', value: '2 hrs' },
          { name: 'Set up event check-in', tag: 'Operations', value: '3 hrs' },
          { name: 'Support social media', tag: 'Marketing', value: '1.5 hrs' },
        ].map((item) => (
          <div key={item.name} className="soft-panel rounded-[22px] p-4"><div className="flex items-center justify-between gap-4"><div><div className="font-extrabold text-[#572D20]">{item.name}</div><div className="text-sm text-[#8B756C]">{item.tag}</div></div><div className="text-sm font-extrabold text-[#3286C7]">{item.value}</div></div></div>
        ))}</div></div>
      </div>
    </div>
  )
}

function VolunteerExplore({ setCategory, applyToEvent, selectedCategory, appliedIds }) {
  return (
    <div className="space-y-6">
      <div className="surface-card rounded-[30px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8B756C]">Explore</p><h1 className="display-font mt-2 text-3xl font-black text-[#572D20]">Discover opportunities</h1></div>
          <div className="flex items-center gap-2 rounded-full border border-[#572D20]/10 bg-white/80 px-3 py-2 text-[#8B756C]"><Search size={16} /><input type="text" placeholder="Search opportunities" className="w-44 border-0 bg-transparent text-sm outline-none" /></div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">{categoryMeta.map(({ key, label, icon: Icon }) => (
          <button key={key} className={`pill-filter ${selectedCategory === key ? 'active' : ''}`} onClick={() => setCategory(key)}><span className="inline-flex items-center gap-2"><Icon size={15} /> {label}</span></button>
        ))}</div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">{(selectedCategory === 'All' ? eventData : eventData.filter((event) => event.category === selectedCategory)).map((event) => (
        <EventCard key={event.id} event={event} isApplied={appliedIds.includes(event.id)} onApply={applyToEvent} />
      ))}</div>
    </div>
  )
}

function MyShiftsPage({ events }) {
  return (
    <div className="space-y-6">
      <div className="surface-card rounded-[30px] p-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8B756C]">My schedule</p><h1 className="display-font mt-2 text-3xl font-black text-[#572D20]">Your upcoming shifts</h1></div>
      <div className="space-y-4">{events.length ? events.map((event) => (
        <div key={event.id} className="surface-card rounded-[28px] p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><div className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#8B756C]">{event.category}</div><h3 className="mt-2 text-2xl font-black text-[#572D20]">{event.title}</h3><div className="mt-3 flex flex-wrap gap-4 text-[#8B756C]"><span className="inline-flex items-center gap-1"><CalendarDays size={16} /> {event.date}</span><span className="inline-flex items-center gap-1"><Clock3 size={16} /> {event.time}</span><span className="inline-flex items-center gap-1"><MapPin size={16} /> {event.location}</span></div></div><div className="flex gap-3"><button className="ghost-button">Manage</button><button className="secondary-button">Check in</button></div></div></div>
      )) : <div className="empty-state"><p className="text-lg font-extrabold text-[#572D20]">You haven’t joined any shifts yet.</p><p className="mt-2 text-[#8B756C]">Explore the list of opportunities and save the ones that match your availability.</p></div>}</div>
    </div>
  )
}

function CommunityPage() {
  return (
    <div className="space-y-6"><div className="surface-card rounded-[30px] p-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8B756C]">Community</p><h1 className="display-font mt-2 text-3xl font-black text-[#572D20]">Your people, your impact</h1></div><div className="grid gap-5 lg:grid-cols-3">{[
      { title: 'Campus volunteers', count: '180+', sub: 'Active this month' },
      { title: 'Societies', count: '12', sub: 'Partnered orgs' },
      { title: 'Events created', count: '36', sub: 'Across campus' },
    ].map((item) => (
      <div key={item.title} className="metric-panel p-5"><div className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#8B756C]">{item.title}</div><div className="mt-3 text-4xl font-black text-[#572D20]">{item.count}</div><div className="mt-1 text-sm text-[#8B756C]">{item.sub}</div></div>
    ))}</div><div className="grid gap-5 lg:grid-cols-2">{storyData.map((story) => (
      <div key={story.name} className="surface-card rounded-[28px] p-5"><div className="mb-4 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FBE0D0] text-lg font-black text-[#572D20]">{story.name.charAt(0)}</div><div><div className="font-extrabold text-[#572D20]">{story.name}</div><div className="text-sm text-[#8B756C]">{story.role}</div></div></div><p className="text-[#572D20]">“{story.quote}”</p></div>
    ))}</div></div>
  )
}

function ProfilePage() {
  return (
    <div className="space-y-6"><div className="surface-card rounded-[30px] p-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8B756C]">Profile</p><h1 className="display-font mt-2 text-3xl font-black text-[#572D20]">Alex Morgan</h1></div><div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><div className="surface-card rounded-[28px] p-6"><div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5C3A5] text-2xl font-black text-[#572D20]">A</div><div><div className="text-2xl font-black text-[#572D20]">Volunteer profile</div><div className="text-[#8B756C]">Design & operations • 2nd year student</div></div></div><div className="mt-6 flex flex-wrap gap-2">{['Design', 'Event Ops', 'Photography', 'Outreach', 'Leadership'].map((tag) => <span key={tag} className="rounded-full bg-[#FBE0D0] px-3 py-2 text-sm font-bold text-[#572D20]">{tag}</span>)}</div></div><div className="surface-card rounded-[28px] p-6"><div className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#8B756C]">Availability</div><div className="mt-4 space-y-3 text-[#572D20]"><div className="flex items-center justify-between"><span>Weekdays</span><span className="font-black">Available</span></div><div className="flex items-center justify-between"><span>Weekends</span><span className="font-black">Open</span></div><div className="flex items-center justify-between"><span>Travel radius</span><span className="font-black">5 km</span></div></div></div></div></div>
  )
}

function OrganizerApp({ setRole }) {
  return (
    <div className="app-shell app-shell-layout">
      <aside className="sidebar">
        <div className="px-3 pb-2"><div className="brand-mark text-[#572D20]">ShiftSpark</div></div>
        <div className="space-y-2">{organiserLinks.map(({ label, to, icon: Icon }) => (
          <NavLink key={label} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{label}</span></NavLink>
        ))}</div>
        <div className="soft-panel mt-auto rounded-[24px] p-4"><div className="mb-2 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.15em] text-[#8B756C]"><Building2 size={16} /> Team pulse</div><div className="text-2xl font-black text-[#572D20]">88%</div><div className="text-sm text-[#8B756C]">volunteer retention</div></div>
      </aside>
      <div className="main-stage">
        <header className="topbar"><div className="flex items-center gap-3"><div className="rounded-full bg-[#FBE0D0] p-2 text-[#572D20]"><Filter size={18} /></div><div className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8B756C]">Organizer control</div></div><div className="role-switch"><button className={false ? 'active' : ''}>Volunteer</button><button className={true ? 'active' : ''}>Organiser</button></div></header>
        <div className="page-inner"><Routes>
          <Route index element={<OrganizerOverview />} />
          <Route path="overview" element={<OrganizerOverview />} />
          <Route path="events" element={<OrganizerEvents />} />
          <Route path="applications" element={<OrganizerApplications />} />
          <Route path="shift-planner" element={<ShiftPlanner />} />
          <Route path="team" element={<OrganizerTeam />} />
          <Route path="analytics" element={<OrganizerAnalytics />} />
        </Routes></div>
      </div>
    </div>
  )
}

function OrganizerOverview() {
  return (
    <div className="space-y-6">
      <div className="surface-card rounded-[30px] p-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8B756C]">Overview</p><h1 className="display-font mt-2 text-3xl font-black text-[#572D20]">Operations dashboard</h1></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[
        { label: 'Open roles', value: '18', tag: '+5 this week' },
        { label: 'Scheduled volunteers', value: '146', tag: '92% filled' },
        { label: 'Avg. check-in time', value: '4 min', tag: '-2 min' },
        { label: 'Event satisfaction', value: '4.8/5', tag: '+0.4' },
      ].map((item) => (
        <div key={item.label} className="metric-panel p-5"><div className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#8B756C]">{item.label}</div><div className="mt-3 text-3xl font-black text-[#572D20]">{item.value}</div><div className="mt-1 text-sm text-[#3286C7]">{item.tag}</div></div>
      ))}</div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card rounded-[28px] p-6"><h2 className="display-font text-2xl font-black text-[#572D20]">Event activity</h2><div className="mt-6 flex h-52 items-end gap-3">{[58, 72, 66, 88, 95, 82, 72].map((height, index) => <div key={index} className="flex-1 rounded-t-[18px] bg-gradient-to-t from-[#3286C7] to-[#A5D1F2]" style={{ height: `${height}%` }} />)}</div></div>
        <div className="surface-card rounded-[28px] p-6"><h2 className="display-font text-2xl font-black text-[#572D20]">Priority tasks</h2><div className="mt-5 space-y-4">{['Finalize stage setup', 'Confirm speaker arrivals', 'Review volunteer waivers'].map((task) => <div key={task} className="soft-panel rounded-[20px] p-3 font-extrabold text-[#572D20]">{task}</div>)}</div></div>
      </div>
    </div>
  )
}

function OrganizerEvents() {
  return (
    <div className="space-y-6"><div className="surface-card rounded-[30px] p-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8B756C]">Events</p><h1 className="display-font mt-2 text-3xl font-black text-[#572D20]">Your campus programs</h1></div><div className="grid gap-5 lg:grid-cols-2">{eventData.slice(0, 4).map((event) => (
      <div key={event.id} className="opportunity-card"><div className="event-image" style={{ backgroundImage: `url(${event.image})` }}><div className="event-badge">{event.category}</div></div><div className="p-5"><div className="flex items-center justify-between gap-3"><h3 className="text-xl font-black text-[#572D20]">{event.title}</h3><span className="rounded-full bg-[#FBE0D0] px-2 py-1 text-xs font-extrabold text-[#572D20]">{event.spots} spots</span></div><p className="mt-3 text-[#8B756C]">{event.summary}</p><div className="mt-4 flex items-center gap-3 text-sm text-[#8B756C]"><span className="inline-flex items-center gap-1"><CalendarDays size={14} /> {event.date}</span><span className="inline-flex items-center gap-1"><MapPin size={14} /> {event.location}</span></div><button className="ghost-button mt-5 w-full justify-center">Manage schedule</button></div></div>
    ))}</div></div>
  )
}

function OrganizerApplications() {
  const applicants = [
    { name: 'Nia Kim', role: 'Check-in Crew', status: 'Shortlisted' },
    { name: 'Harper Singh', role: 'Media Team', status: 'Pending' },
    { name: 'Luis Alvarez', role: 'Stage Support', status: 'Accepted' },
  ]
  return (
    <div className="space-y-6"><div className="surface-card rounded-[30px] p-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8B756C]">Applications</p><h1 className="display-font mt-2 text-3xl font-black text-[#572D20]">Volunteer applications</h1></div><div className="space-y-4">{applicants.map((person) => (
      <div key={person.name} className="surface-card flex flex-col gap-4 rounded-[26px] p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-xl font-black text-[#572D20]">{person.name}</div><div className="text-[#8B756C]">{person.role}</div></div><div className="flex items-center gap-3"><span className="rounded-full bg-[#FBE0D0] px-3 py-2 text-sm font-extrabold text-[#572D20]">{person.status}</span><button className="ghost-button">Review</button></div></div>
    ))}</div></div>
  )
}

function ShiftPlanner() {
  return (
    <div className="space-y-6"><div className="surface-card rounded-[30px] p-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8B756C]">Shift planner</p><h1 className="display-font mt-2 text-3xl font-black text-[#572D20]">Schedule overview</h1></div><div className="surface-card rounded-[28px] p-6"><div className="grid gap-3 md:grid-cols-4">{[['08:00', 'Check-in crew'], ['10:30', 'Stage team'], ['13:00', 'Media pod'], ['17:00', 'Wrap-up crew']].map(([time, title]) => (
      <div key={time} className="soft-panel rounded-[20px] p-4"><div className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#8B756C]">{time}</div><div className="mt-2 text-lg font-black text-[#572D20]">{title}</div></div>
    ))}</div></div></div>
  )
}

function OrganizerTeam() {
  const team = [
    { name: 'Sana', role: 'Operations Lead' },
    { name: 'Jae', role: 'Volunteer Coordinator' },
    { name: 'Noah', role: 'Community Manager' },
  ]
  return (
    <div className="space-y-6"><div className="surface-card rounded-[30px] p-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8B756C]">Team</p><h1 className="display-font mt-2 text-3xl font-black text-[#572D20]">Campus organizers</h1></div><div className="grid gap-5 md:grid-cols-3">{team.map((person) => (
      <div key={person.name} className="surface-card rounded-[28px] p-5 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5C3A5] text-2xl font-black text-[#572D20]">{person.name.charAt(0)}</div><div className="mt-4 text-xl font-black text-[#572D20]">{person.name}</div><div className="text-[#8B756C]">{person.role}</div></div>
    ))}</div></div>
  )
}

function OrganizerAnalytics() {
  return (
    <div className="space-y-6"><div className="surface-card rounded-[30px] p-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8B756C]">Analytics</p><h1 className="display-font mt-2 text-3xl font-black text-[#572D20]">Impact at a glance</h1></div><div className="grid gap-5 md:grid-cols-3">{[
      { label: 'Volunteer turnout', value: '94%' },
      { label: 'Avg. satisfaction', value: '4.8/5' },
      { label: 'Hours logged', value: '426' },
    ].map((stat) => (
      <div key={stat.label} className="metric-panel p-5"><div className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#8B756C]">{stat.label}</div><div className="mt-3 text-3xl font-black text-[#572D20]">{stat.value}</div></div>
    ))}</div></div>
  )
}

function EventCard({ event, isApplied, onApply }) {
  return (
    <article className="opportunity-card">
      <div className="event-image" style={{ backgroundImage: `url(${event.image})` }}><div className="event-badge">{event.category}</div></div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2"><div><h3 className="text-xl font-black text-[#572D20]">{event.title}</h3><div className="mt-1 text-sm font-extrabold text-[#8B756C]">{event.organizer}</div></div><div className="rounded-full bg-[#FBE0D0] px-2 py-1 text-xs font-extrabold text-[#572D20]">{event.spots} spots</div></div>
        <div className="mt-4 space-y-2 text-sm text-[#8B756C]"><div className="flex items-center gap-2"><CalendarDays size={15} /> {event.date}</div><div className="flex items-center gap-2"><MapPin size={15} /> {event.location}</div></div>
        <p className="mt-4 text-[#572D20]">{event.summary}</p>
        <div className="mt-5 flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-sm font-bold text-[#3286C7]"><MessageSquareText size={15} /> {event.category}</span><button className={isApplied ? 'secondary-button' : 'primary-button'} onClick={() => onApply(event.id)}>{isApplied ? 'Joined' : 'Apply'}</button></div>
      </div>
    </article>
  )
}

export default App

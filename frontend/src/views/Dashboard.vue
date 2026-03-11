<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <div class="w-64 bg-[#1e1e2d] text-gray-300 flex flex-col transition-all duration-300">
      <div class="p-6">
        <div class="flex items-center space-x-3 mb-8">
          <div class="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xs">IS</div>
          <span class="text-xs uppercase font-semibold tracking-wider text-gray-400">Information System</span>
        </div>
        
        <div class="mb-8">
          <h1 class="text-sm font-bold text-white leading-tight">College of Computing Studies</h1>
          <p class="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">Academic Year 2026-2027</p>
        </div>

        <div class="flex items-center space-x-3 p-3 bg-[#2b2b40] rounded-lg mb-8">
          <div class="w-10 h-10 bg-orange-600 rounded flex items-center justify-center text-white font-bold text-lg">
            {{ authStore.user?.name?.charAt(0) }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-white truncate">{{ authStore.user?.name }}</p>
            <p class="text-[9px] text-gray-400 uppercase">{{ authStore.user?.role }} / HEAD OF DEPT</p>
          </div>
        </div>

        <nav class="space-y-1">
          <div class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 mt-4">Overview</div>
          <a href="#" class="flex items-center space-x-3 p-2 rounded-lg bg-orange-600/10 text-orange-500 border-r-4 border-orange-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            <span class="text-sm">Dashboard</span>
          </a>
          <a v-if="authStore.isDean" href="#" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span class="text-sm">Reports</span>
          </a>

          <!-- Dean Academic Section -->
          <template v-if="authStore.isDean">
            <div class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 mt-6">Academic</div>
            <a href="#" class="flex items-center justify-between p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                <span class="text-sm">Students</span>
              </div>
              <span class="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">842</span>
            </a>
            <a href="#" class="flex items-center justify-between p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                <span class="text-sm">Faculty</span>
              </div>
              
              <span class="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">38</span>
            </a>
            <a href="#" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span class="text-sm">Academic Performance</span>
            </a>
            <a href="#" class="flex items-center justify-between p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <span class="text-sm">Violations</span>
              </div>
              <span class="text-[10px] bg-red-900/40 px-1.5 py-0.5 rounded text-red-400 font-bold">12</span>
            </a>
          </template>

          <!-- Faculty Academic Section -->
          <template v-else>
            <div class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 mt-6">My Classes</div>
            <a href="#" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"></path></svg>
              <span class="text-sm">My Schedule</span>
            </a>
            <a href="#" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.082.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              <span class="text-sm">My Subjects</span>
            </a>
            <a href="#" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span class="text-sm">My Classes</span>
            </a>
            <div class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 mt-6">Monitoring</div>
            <a href="#" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span class="text-sm">Student Profiles</span>
            </a>
            <a href="#" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <span class="text-sm">Record Violation</span>
            </a>
          </template>

          <div class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 mt-6">Management</div>
          <a v-if="authStore.isDean" href="#" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span class="text-sm">Faculty Schedule</span>
          </a>
          <a v-if="authStore.isFaculty" href="#" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
            <span class="text-sm">Recommend Award</span>
          </a>
          <a href="#" class="flex items-center justify-between p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              <span class="text-sm">Awards & Recognition</span>
            </div>
            <span v-if="authStore.isDean" class="text-[10px] bg-orange-900/40 px-1.5 py-0.5 rounded text-orange-400 font-bold">3</span>
          </a>
          <a href="#" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#2b2b40] hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span class="text-sm">Settings</span>
          </a>
        </nav>
      </div>

      <div class="mt-auto p-6 border-t border-[#2b2b40]">
        <button @click="handleLogout" class="flex items-center space-x-3 text-sm text-gray-500 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white border-b p-4 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-800">Dashboard</h2>
          <p class="text-xs text-gray-400">Overview of department academic performance & activity</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input type="text" placeholder="Search students, faculty..." class="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all w-64" />
          </div>
          <button class="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
          <div class="text-xs font-bold bg-orange-100 text-orange-600 px-3 py-2 rounded-lg">March 10, 2026</div>
        </div>
      </header>

      <!-- Dashboard Content -->
      <main class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Hero Banner -->
        <div class="bg-gradient-to-r from-orange-600 to-orange-400 rounded-3xl p-8 text-white relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="text-2xl font-bold">Good morning, {{ authStore.user?.name?.split(' ')[1] }} 👋</h3>
            <p class="mt-2 text-orange-50 max-w-md">You have 3 pending recognition approvals and 12 student violations requiring your attention this week.</p>
            <div class="mt-6 flex space-x-3">
              <button class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Generate Report</button>
              <button class="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Pending Approvals (3)</button>
            </div>
          </div>
          <!-- Decorative circle -->
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute right-10 bottom-10 flex space-x-2">
            <button class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm transition-colors">+ New Report</button>
            <button class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm transition-colors">View All</button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Students</span>
              <div class="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
            </div>
            <div class="flex items-end justify-between">
              <h4 class="text-3xl font-bold text-gray-800">842</h4>
              <div class="text-[10px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded">↑ 4.2% vs last sem</div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Faculty</span>
              <div class="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
            </div>
            <div class="flex items-end justify-between">
              <h4 class="text-3xl font-bold text-gray-800">38</h4>
              <div class="text-[10px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded">↑ 2 new this sem</div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Dept. Avg GWA</span>
              <div class="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
            </div>
            <div class="flex items-end justify-between">
              <h4 class="text-3xl font-bold text-gray-800">1.87</h4>
              <div class="text-[10px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded">↑ 0.04 improvement</div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">With Violations</span>
              <div class="p-1.5 bg-red-100 text-red-600 rounded-lg">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
            </div>
            <div class="flex items-end justify-between">
              <h4 class="text-3xl font-bold text-gray-800">12</h4>
              <div class="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">↑ 3 this month</div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Award Nominations</span>
              <div class="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              </div>
            </div>
            <div class="flex items-end justify-between">
              <h4 class="text-3xl font-bold text-gray-800">7</h4>
              <div class="text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">3 pending review</div>
            </div>
          </div>
        </div>

        <!-- Charts and Lists -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Academic Performance Trends -->
          <div class="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h5 class="text-sm font-bold text-gray-800">Academic Performance Trends</h5>
                <p class="text-[10px] text-gray-400">Average GWA per semester - last 6 semesters</p>
              </div>
              <a href="#" class="text-[10px] text-orange-500 font-bold hover:underline">Details →</a>
            </div>
            <div class="h-48 flex items-end space-x-2">
              <div v-for="(h, i) in [40, 55, 45, 60, 65, 80]" :key="i" class="flex-1 flex flex-col items-center">
                <div :class="`w-full rounded-t ${i === 5 ? 'bg-orange-500' : 'bg-orange-200'}`" :style="{ height: h + '%' }"></div>
                <span class="text-[8px] text-gray-400 mt-2 uppercase">{{ ['1st \'22', '2nd \'22', '1st \'23', '2nd \'23', '1st \'24', '2nd \'24'][i] }}</span>
              </div>
            </div>
            <div class="mt-6 flex items-center space-x-4">
              <div class="flex items-center space-x-1.5">
                <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                <span class="text-[9px] text-gray-500">Current Sem</span>
              </div>
              <div class="flex items-center space-x-1.5">
                <div class="w-2 h-2 rounded-full bg-orange-200"></div>
                <span class="text-[9px] text-gray-500">Previous Sem</span>
              </div>
            </div>
          </div>

          <!-- Top Performing Students -->
          <div class="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h5 class="text-sm font-bold text-gray-800">Top Performing Students</h5>
                <p class="text-[10px] text-gray-400">Ranked by GWA - current semester</p>
              </div>
              <a href="#" class="text-[10px] text-orange-500 font-bold hover:underline">View all →</a>
            </div>
            <div class="space-y-4">
              <div v-for="(s, i) in topStudents" :key="i" class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <span class="text-xs font-bold text-gray-300">{{ i + 1 }}</span>
                  <div :class="`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${s.color}`">
                    {{ s.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-800">{{ s.name }}</p>
                    <p class="text-[9px] text-gray-400">{{ s.course }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <span :class="`text-[9px] font-bold px-1.5 py-0.5 rounded ${s.tagColor}`">{{ s.tag }}</span>
                  <span class="text-xs font-bold text-gray-800">{{ s.gwa }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Student Violations -->
          <div class="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h5 class="text-sm font-bold text-gray-800">Student Violations</h5>
                <p class="text-[10px] text-gray-400">Active cases this semester</p>
              </div>
              <a href="#" class="text-[10px] text-orange-500 font-bold hover:underline">View all →</a>
            </div>
            <div class="space-y-4">
              <div v-for="(v, i) in violations" :key="i" class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div class="flex items-center space-x-3">
                  <div :class="`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${v.color}`">
                    {{ v.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-800">{{ v.name }}</p>
                    <p class="text-[9px] text-gray-400">{{ v.type }}</p>
                  </div>
                </div>
                <span :class="`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${v.tagColor}`">{{ v.severity }}</span>
              </div>
            </div>
            <div class="mt-6 p-3 bg-red-50 rounded-xl flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                <span class="text-[10px] font-bold text-red-700">8 more cases need review</span>
              </div>
              <button class="text-red-500 text-[10px] font-bold">Review Now</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const topStudents = [
  { name: 'Aira Mae Reyes', course: 'BSCS - 4th Year', tag: 'Dean\'s List', gwa: '1.21', color: 'bg-yellow-500', tagColor: 'text-green-600 bg-green-50' },
  { name: 'Jose Miguel Cruz', course: 'BSIT - 3rd Year', tag: 'Dean\'s List', gwa: '1.34', color: 'bg-blue-500', tagColor: 'text-green-600 bg-green-50' },
  { name: 'Katrina Villanueva', course: 'BSCS - 4th Year', tag: 'Dean\'s List', gwa: '1.38', color: 'bg-green-500', tagColor: 'text-green-600 bg-green-50' },
  { name: 'Mark Daniel Lim', course: 'BSIT - 2nd Year', tag: 'Rising', gwa: '1.42', color: 'bg-orange-500', tagColor: 'text-orange-600 bg-orange-50' },
  { name: 'Sofia Tan Garcia', course: 'BSCS - 3rd Year', tag: 'Rising', gwa: '1.47', color: 'bg-purple-500', tagColor: 'text-orange-600 bg-orange-50' }
]

const violations = [
  { name: 'Ryan Santos', type: 'Academic Dishonesty', severity: 'Major', color: 'bg-red-700', tagColor: 'text-red-600 bg-red-50' },
  { name: 'Luis Pascual', type: 'Excessive Absences', severity: 'Moderate', color: 'bg-orange-700', tagColor: 'text-orange-600 bg-orange-50' },
  { name: 'Ana Bautista', type: 'Dress Code Violation', severity: 'Minor', color: 'bg-yellow-600', tagColor: 'text-yellow-600 bg-yellow-50' },
  { name: 'Earl Mendoza', type: 'Misconduct (2nd offense)', severity: 'Major', color: 'bg-red-800', tagColor: 'text-red-600 bg-red-50' }
]
</script>

<style scoped>
/* Custom scrollbar for main content */
main::-webkit-scrollbar {
  width: 6px;
}
main::-webkit-scrollbar-track {
  background: transparent;
}
main::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}
main::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>

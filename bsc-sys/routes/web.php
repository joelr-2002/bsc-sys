<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    
    // BSC Routes
    Route::inertia('strategic-plans', 'strategic-plans/index')->name('strategic-plans.index');
    Route::inertia('perspectives', 'perspectives/index')->name('perspectives.index');
    Route::inertia('kpis', 'kpis/index')->name('kpis.index');
    Route::inertia('reports', 'reports/index')->name('reports.index');
    Route::inertia('strategic-map', 'strategic-map/index')->name('strategic-map.index');
    Route::inertia('data-sources', 'data-sources/index')->name('data-sources.index');
    Route::inertia('users', 'users/index')->name('users.index');
});

// Ruta demo de Ant Design
Route::get('/antd-demo', function () {
    return inertia('antd-demo');
})->name('antd-demo');

require __DIR__.'/settings.php';

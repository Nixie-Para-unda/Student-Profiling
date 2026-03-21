<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'student_number',
        'password',
        'role',
        'email_verified_at',
        'password_setup_token',
        'password_set_at',
        'status',
    ];

    public function student(): HasOne
    {
        return $this->hasOne(Student::class);
    }

    public function faculty(): HasOne
    {
        return $this->hasOne(Faculty::class);
    }

    public function isDean(): bool
    {
        return $this->role === 'dean';
    }

    public function isDepartmentChair(): bool
    {
        return $this->role === 'department_chair';
    }

    public function isSecretary(): bool
    {
        return $this->role === 'secretary';
    }

    public function isFaculty(): bool
    {
        return $this->role === 'faculty';
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    public function getNameAttribute()
    {
        if ($this->isStudent()) {
            return $this->student ? $this->student->first_name . ' ' . $this->student->last_name : $this->email;
        }
        if ($this->isFaculty()) {
            return $this->faculty ? $this->faculty->first_name . ' ' . $this->faculty->last_name : $this->email;
        }
        return $this->email;
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}

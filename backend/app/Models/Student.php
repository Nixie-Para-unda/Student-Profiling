<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'program_id',
        'section_id',
        'first_name',
        'last_name',
        'middle_name',
        'birthdate',
        'civil_status',
        'gender',
        'contact_number',
        'address',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function guardian(): HasOne
    {
        return $this->hasOne(Guardian::class);
    }

    public function skills(): HasMany
    {
        return $this->hasMany(StudentSkill::class);
    }

    public function subjects(): HasMany
    {
        return $this->hasMany(StudentSubject::class);
    }

    public function violations(): HasMany
    {
        return $this->hasMany(StudentViolation::class);
    }

    public function academicActivities(): HasMany
    {
        return $this->hasMany(AcademicActivity::class);
    }

    public function nonAcademicActivities(): HasMany
    {
        return $this->hasMany(NonAcademicActivity::class);
    }

    public function organizations(): HasMany
    {
        return $this->hasMany(StudentOrganization::class);
    }

    public function awards(): HasMany
    {
        return $this->hasMany(AcademicAward::class);
    }
}

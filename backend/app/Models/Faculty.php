<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Faculty extends Model
{
    use HasFactory;

    protected $table = 'faculty'; // manually specifying because plural is usually 'faculties' but table is 'faculty'

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'department_id',
        'position',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subjectLoads(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SubjectLoad::class);
    }
}

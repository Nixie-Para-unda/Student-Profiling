<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('department_name'); // e.g., College of Computing Studies
            $table->timestamps();
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('course_code')->unique(); // e.g., BSIT, BSCS
            $table->string('course_name');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('faculty', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->string('position');
            $table->string('status');
            $table->timestamps();
        });

        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('subject_code')->unique();
            $table->string('subject_name');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_name');
            $table->string('year_level');
            $table->string('school_year');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('adviser_id')->nullable()->constrained('faculty')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('subject_loads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_id')->constrained('faculty')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('section_id')->constrained('sections')->onDelete('cascade');
            $table->string('schedule')->nullable();
            $table->timestamps();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('student_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->string('gender')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('civil_status')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->unique();
            $table->string('address')->nullable();
            $table->foreignId('section_id')->nullable()->constrained('sections')->onDelete('cascade');
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        Schema::create('violation_types', function (Blueprint $table) {
            $table->id();
            $table->string('violation_name');
            $table->string('severity_level');
            $table->timestamps();
        });

        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->string('organization_name');
            $table->string('organization_type');
            $table->timestamps();
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('skill_name');
            $table->string('skill_category');
            $table->timestamps();
        });

        Schema::create('faculty_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_id')->constrained('faculty')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->string('school_year');
            $table->string('semester');
            $table->timestamps();
        });

        Schema::create('student_violations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('violation_type_id')->constrained('violation_types')->onDelete('cascade');
            $table->date('violation_date');
            $table->text('description')->nullable();
            $table->string('action_taken')->nullable();
            $table->string('status');
            $table->timestamps();
        });

        Schema::create('academic_awards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->string('school_year');
            $table->string('semester');
            $table->float('gpa');
            $table->string('honors')->nullable();
            $table->timestamps();
        });

        Schema::create('student_organizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->string('role');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('status');
            $table->timestamps();
        });

        Schema::create('student_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('skill_id')->constrained('skills')->onDelete('cascade');
            $table->string('skill_level');
            $table->string('certification')->nullable();
            $table->date('date_acquired');
            $table->timestamps();
        });

        Schema::create('non_academic_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->string('activity_name');
            $table->string('category');
            $table->string('achievement')->nullable();
            $table->date('activity_date');
            $table->timestamps();
        });

        Schema::create('faculty_organizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_id')->constrained('faculty')->onDelete('cascade');
            $table->foreignId('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->string('role');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_organizations');
        Schema::dropIfExists('non_academic_activities');
        Schema::dropIfExists('student_skills');
        Schema::dropIfExists('student_organizations');
        Schema::dropIfExists('academic_awards');
        Schema::dropIfExists('student_violations');
        Schema::dropIfExists('faculty_subjects');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('organizations');
        Schema::dropIfExists('violation_types');
        Schema::dropIfExists('students');
        Schema::dropIfExists('sections');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('faculty');
        Schema::dropIfExists('departments');
    }
};

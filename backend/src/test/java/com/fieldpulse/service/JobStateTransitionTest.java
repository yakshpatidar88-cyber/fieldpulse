package com.fieldpulse.service;

import com.fieldpulse.domain.entity.Job;
import com.fieldpulse.domain.entity.Sla;
import com.fieldpulse.domain.entity.User;
import com.fieldpulse.domain.enums.AuditAction;
import com.fieldpulse.domain.enums.JobPriority;
import com.fieldpulse.domain.enums.JobStatus;
import com.fieldpulse.dto.JobDto;
import com.fieldpulse.dto.triage.JobStatusTransitionDto;
import com.fieldpulse.exception.BusinessValidationException;
import com.fieldpulse.exception.StateTransitionException;
import com.fieldpulse.repository.JobRepository;
import com.fieldpulse.service.impl.JobServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobStateTransitionTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private SlaService slaService;

    @Mock
    private AuditService auditService;

    @Mock
    private InventoryService inventoryService;

    private JobService jobService;

    @BeforeEach
    void setUp() {
        jobService = new JobServiceImpl(jobRepository, slaService, auditService, inventoryService);
    }

    @Test
    @DisplayName("Status Enum: should validate permitted state transitions")
    void testEnumStateTransitions() {
        // CREATED can only go to TRIAGED or CANCELLED
        assertTrue(JobStatus.CREATED.canTransitionTo(JobStatus.TRIAGED));
        assertTrue(JobStatus.CREATED.canTransitionTo(JobStatus.CANCELLED));
        assertFalse(JobStatus.CREATED.canTransitionTo(JobStatus.COMPLETED));

        // TRIAGED can go to ASSIGNED or CANCELLED
        assertTrue(JobStatus.TRIAGED.canTransitionTo(JobStatus.ASSIGNED));
        assertTrue(JobStatus.TRIAGED.canTransitionTo(JobStatus.CANCELLED));
        assertFalse(JobStatus.TRIAGED.canTransitionTo(JobStatus.IN_PROGRESS));

        // ASSIGNED can go to ACCEPTED, TRIAGED (re-assignment), or CANCELLED
        assertTrue(JobStatus.ASSIGNED.canTransitionTo(JobStatus.ACCEPTED));
        assertTrue(JobStatus.ASSIGNED.canTransitionTo(JobStatus.TRIAGED));

        // ACCEPTED can go to IN_PROGRESS or CANCELLED
        assertTrue(JobStatus.ACCEPTED.canTransitionTo(JobStatus.IN_PROGRESS));

        // IN_PROGRESS can go to COMPLETED or CANCELLED
        assertTrue(JobStatus.IN_PROGRESS.canTransitionTo(JobStatus.COMPLETED));

        // COMPLETED and CANCELLED are terminal
        assertFalse(JobStatus.COMPLETED.canTransitionTo(JobStatus.IN_PROGRESS));
        assertFalse(JobStatus.COMPLETED.canTransitionTo(JobStatus.CANCELLED));
        assertFalse(JobStatus.CANCELLED.canTransitionTo(JobStatus.CREATED));
    }

    @Test
    @DisplayName("Should successfully transition job from IN_PROGRESS to COMPLETED with valid notes")
    void testTransitionToCompletedSuccess() {
        Job job = new Job();
        job.setId(100L);
        job.setJobNumber("JOB-2026-0001");
        job.setStatus(JobStatus.IN_PROGRESS);
        job.setPriority(JobPriority.HIGH);
        Sla sla = new Sla();
        job.setSla(sla);

        User caller = new User();
        caller.setEmail("tech.alex@fieldpulse.io");

        JobStatusTransitionDto transitionDto = new JobStatusTransitionDto(
                JobStatus.COMPLETED,
                "Repaired commercial HVAC sensor and verified operating pressure."
        );

        when(jobRepository.findById(100L)).thenReturn(Optional.of(job));
        when(jobRepository.save(any(Job.class))).thenAnswer(inv -> inv.getArgument(0));

        JobDto result = jobService.transitionJobStatus(100L, transitionDto, caller);

        assertEquals(JobStatus.COMPLETED, result.getStatus());
        assertNotNull(job.getCompletedAt());
        assertEquals("Repaired commercial HVAC sensor and verified operating pressure.", job.getCompletionNotes());

        // Verify SLA resolution recorded
        verify(slaService, times(1)).recordResolution(eq(sla), any());

        // Verify audit log
        verify(auditService, times(1)).logEvent(
                eq("Job"),
                eq(100L),
                eq(AuditAction.JOB_COMPLETED),
                eq(caller),
                eq("IN_PROGRESS"),
                eq("COMPLETED"),
                any()
        );
    }

    @Test
    @DisplayName("Should reject transition to COMPLETED if completion notes are missing")
    void testTransitionToCompletedFailsWithoutNotes() {
        Job job = new Job();
        job.setId(100L);
        job.setStatus(JobStatus.IN_PROGRESS);

        JobStatusTransitionDto transitionDto = new JobStatusTransitionDto(JobStatus.COMPLETED, "");

        when(jobRepository.findById(100L)).thenReturn(Optional.of(job));

        BusinessValidationException ex = assertThrows(
                BusinessValidationException.class,
                () -> jobService.transitionJobStatus(100L, transitionDto, null)
        );

        assertTrue(ex.getMessage().contains("Completion notes are mandatory"));
        verify(jobRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw StateTransitionException on disallowed state jump")
    void testInvalidTransitionThrowsException() {
        Job job = new Job();
        job.setId(100L);
        job.setJobNumber("JOB-2026-0001");
        job.setStatus(JobStatus.CREATED);

        JobStatusTransitionDto transitionDto = new JobStatusTransitionDto(JobStatus.COMPLETED, "Trying to jump");

        when(jobRepository.findById(100L)).thenReturn(Optional.of(job));

        assertThrows(
                StateTransitionException.class,
                () -> jobService.transitionJobStatus(100L, transitionDto, null)
        );

        verify(jobRepository, never()).save(any());
        verify(auditService, never()).logEvent(any(), any(), any(), any(), any(), any(), any());
    }
}

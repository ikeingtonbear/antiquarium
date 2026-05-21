/**
 * Unit Tests — StatsDashboard Component
 *
 * TDD: These tests are written BEFORE the component implementation
 * to drive the design of the StatsDashboard Vue SFC.
 *
 * Tests cover:
 * - T017 [US2]: Session stats display format
 * - T022 [US3]: Session termination action and state reset
 *
 * @see plan.md §4 — Capture Statistics Dashboard
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import StatsDashboard from '@/components/StatsDashboard.vue';
import type { CaptureStatistics } from '@/types';

const defaultStats: CaptureStatistics = {
  frames: 1280,
  bytes: 524288,
  duration: 4.529,
  firstPacketTime: '2026-05-21T18:00:00.001Z',
  lastPacketTime: '2026-05-21T18:00:04.530Z',
};

describe('StatsDashboard', () => {
  let wrapper: VueWrapper;

  afterEach(() => {
    wrapper?.unmount();
  });

  /* ──────────────────────────────────────────────────
     T017 [US2]: Stats Display Format
     ────────────────────────────────────────────────── */

  describe('Stats Display', () => {
    it('renders the frames count', () => {
      wrapper = mount(StatsDashboard, {
        props: { statistics: defaultStats, isDeleting: false },
      });

      expect(wrapper.text()).toContain('1,280');
    });

    it('renders formatted byte size', () => {
      wrapper = mount(StatsDashboard, {
        props: { statistics: defaultStats, isDeleting: false },
      });

      // 524288 bytes = 512.00 KB
      expect(wrapper.text()).toContain('512');
    });

    it('renders duration formatted to 3 decimal places', () => {
      wrapper = mount(StatsDashboard, {
        props: { statistics: defaultStats, isDeleting: false },
      });

      expect(wrapper.text()).toContain('4.529');
    });

    it('renders first packet time formatted', () => {
      wrapper = mount(StatsDashboard, {
        props: { statistics: defaultStats, isDeleting: false },
      });

      // Should contain the formatted timestamp
      expect(wrapper.text()).toContain('2026-05-21');
    });

    it('renders last packet time formatted', () => {
      wrapper = mount(StatsDashboard, {
        props: { statistics: defaultStats, isDeleting: false },
      });

      expect(wrapper.text()).toContain('2026-05-21');
    });

    it('renders stat cards with appropriate labels', () => {
      wrapper = mount(StatsDashboard, {
        props: { statistics: defaultStats, isDeleting: false },
      });

      const text = wrapper.text();
      expect(text).toContain('Frames');
      expect(text).toContain('Bytes');
      expect(text).toContain('Duration');
      expect(text).toContain('First Packet');
      expect(text).toContain('Last Packet');
    });

    it('handles missing optional packet times gracefully', () => {
      const statsNoTimes: CaptureStatistics = {
        frames: 100,
        bytes: 8192,
        duration: 1.0,
      };

      wrapper = mount(StatsDashboard, {
        props: { statistics: statsNoTimes, isDeleting: false },
      });

      // Should render N/A or similar for missing times
      expect(wrapper.text()).toContain('N/A');
    });
  });

  /* ──────────────────────────────────────────────────
     T022 [US3]: Acknowledge Button & Session Termination
     ────────────────────────────────────────────────── */

  describe('Acknowledge Button', () => {
    it('renders an Acknowledge button', () => {
      wrapper = mount(StatsDashboard, {
        props: { statistics: defaultStats, isDeleting: false },
      });

      const btn = wrapper.find('button');
      expect(btn.exists()).toBe(true);
      expect(btn.text()).toContain('Acknowledge');
    });

    it('emits "acknowledge" when clicked', async () => {
      wrapper = mount(StatsDashboard, {
        props: { statistics: defaultStats, isDeleting: false },
      });

      const btn = wrapper.find('button');
      await btn.trigger('click');

      expect(wrapper.emitted('acknowledge')).toBeTruthy();
      expect(wrapper.emitted('acknowledge')!.length).toBe(1);
    });

    it('disables button and shows spinner when isDeleting is true', () => {
      wrapper = mount(StatsDashboard, {
        props: { statistics: defaultStats, isDeleting: true },
      });

      const btn = wrapper.find('button');
      expect(btn.attributes('disabled')).toBeDefined();

      // Should show a loading state
      const spinner = wrapper.find('.btn-spinner');
      expect(spinner.exists()).toBe(true);
    });
  });
});

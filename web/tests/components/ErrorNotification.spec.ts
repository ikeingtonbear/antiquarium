/**
 * Unit Tests — ErrorNotification Component
 *
 * TDD: These tests are written BEFORE the component implementation
 * to drive the design of the ErrorNotification Vue SFC.
 *
 * @see plan.md §5 — Floating Error Notifications
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import ErrorNotification from '@/components/ErrorNotification.vue';

describe('ErrorNotification', () => {
  let wrapper: VueWrapper;

  afterEach(() => {
    wrapper?.unmount();
    vi.restoreAllMocks();
  });

  it('renders the error message text', () => {
    wrapper = mount(ErrorNotification, {
      props: { message: 'Network error occurred' },
    });

    expect(wrapper.text()).toContain('Network error occurred');
  });

  it('has role="alert" for screen reader announcement', () => {
    wrapper = mount(ErrorNotification, {
      props: { message: 'Server unreachable' },
    });

    const alert = wrapper.find('[role="alert"]');
    expect(alert.exists()).toBe(true);
  });

  it('has aria-live="assertive" for immediate announcement', () => {
    wrapper = mount(ErrorNotification, {
      props: { message: 'Upload failed' },
    });

    const alert = wrapper.find('[aria-live="assertive"]');
    expect(alert.exists()).toBe(true);
  });

  it('renders a dismiss (close) button', () => {
    wrapper = mount(ErrorNotification, {
      props: { message: 'Something went wrong' },
    });

    const closeBtn = wrapper.find('button[aria-label="Dismiss error"]');
    expect(closeBtn.exists()).toBe(true);
  });

  it('emits "dismiss" when close button is clicked', async () => {
    wrapper = mount(ErrorNotification, {
      props: { message: 'Connection lost' },
    });

    const closeBtn = wrapper.find('button[aria-label="Dismiss error"]');
    await closeBtn.trigger('click');

    expect(wrapper.emitted('dismiss')).toBeTruthy();
    expect(wrapper.emitted('dismiss')!.length).toBe(1);
  });

  it('auto-dismisses after 6 seconds', async () => {
    vi.useFakeTimers();

    wrapper = mount(ErrorNotification, {
      props: { message: 'Temporary error' },
    });

    vi.advanceTimersByTime(6000);

    expect(wrapper.emitted('dismiss')).toBeTruthy();

    vi.useRealTimers();
  });

  it('renders a shrinking timer bar', () => {
    wrapper = mount(ErrorNotification, {
      props: { message: 'Timed notification' },
    });

    const timerBar = wrapper.find('.error-toast-timer');
    expect(timerBar.exists()).toBe(true);
  });

  it('applies the slide-in animation class', () => {
    wrapper = mount(ErrorNotification, {
      props: { message: 'Animated toast' },
    });

    const toast = wrapper.find('.error-toast');
    expect(toast.exists()).toBe(true);
  });
});

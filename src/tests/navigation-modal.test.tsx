// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import Header from '@/components/Header';
import Modal from '@/components/Modal';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it('opens and closes help repeatedly without changing its hook sequence', () => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const onClose = vi.fn();
  const view = (isOpen: boolean) => <Modal isOpen={isOpen} onClose={onClose}>Help</Modal>;
  const rendered = render(view(false));
  for (let i = 0; i < 2; i++) {
    rendered.rerender(view(true));
    expect(screen.getByText('Help')).toBeTruthy();
    rendered.rerender(view(false));
  }
  expect(errors.mock.calls).toEqual([]);
});

it('moves focus into open navigation and returns it to the trigger on Escape', () => {
  render(<Header />);
  const trigger = screen.getByRole('button', { name: 'Open menu' });
  fireEvent.click(trigger);
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close menu' }));
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(trigger);
});

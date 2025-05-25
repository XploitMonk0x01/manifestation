import React from 'react';
import { render, screen } from '@testing-library/react';
import WishCard from '../WishCard'; // Adjust path as necessary

describe('WishCard Component', () => {
  const mockWish = {
    text: 'I wish for a sunny day tomorrow.',
    date: new Date('2024-07-15T10:30:00Z'), // Use a fixed date for consistent formatting
  };

  it('renders the wish text correctly', () => {
    render(<WishCard text={mockWish.text} date={mockWish.date} />);
    expect(screen.getByText(mockWish.text)).toBeInTheDocument();
  });

  it('renders the date formatted correctly', () => {
    render(<WishCard text={mockWish.text} date={mockWish.date} />);
    // Expected format: "Sent on: July 15, 2024 - 10:30 AM" (or similar based on locale)
    // We need to be careful with exact time formatting due to potential locale differences in test environments.
    // Let's check for parts of the date string.
    const expectedDateString = /Sent on: July 15, 2024 - (10:30 AM|03:30 PM|10:30|15:30)/i; // Accommodate different time formats
    
    // To make this more robust, we can format the date in the test similarly to how the component does.
    const d = mockWish.date;
    const formattedDateInTest = `Sent on: ${d.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })} - ${d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
    
    expect(screen.getByText(formattedDateInTest)).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<WishCard text={mockWish.text} date={mockWish.date} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

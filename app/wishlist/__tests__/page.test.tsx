import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import WishlistPage from '../page'; // Adjust path to your Wishlist page component
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mocks are already in jest.setup.js, but we can override useSession per test suite / test case
// and fetch per test case.
const mockUseSession = useSession as jest.Mock;
const mockUseRouter = useRouter as jest.Mock; // If we need to assert router.push

describe('WishlistPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset mocks for each test
    (global.fetch as jest.Mock).mockClear();
    mockUseSession.mockClear();
    mockPush.mockClear();
    mockUseRouter.mockReturnValue({ push: mockPush }); // Ensure router mock is fresh
  });

  describe('Loading State', () => {
    it('displays "Gathering Stardust..." when session status is loading', () => {
      mockUseSession.mockReturnValue({ data: null, status: 'loading' });
      render(<WishlistPage />);
      expect(screen.getByText('Gathering Stardust...')).toBeInTheDocument();
    });

    it('displays "Gathering Stardust..." when internal loading state is true (after session is authenticated)', async () => {
      mockUseSession.mockReturnValue({ 
        data: { user: { id: '1', email: 'test@example.com', name: 'Test User' } }, 
        status: 'authenticated' 
      });
      // Mock fetch to be pending initially
      (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {})); // Never resolves
      render(<WishlistPage />);
      expect(screen.getByText('Gathering Stardust...')).toBeInTheDocument();
    });
  });

  describe('Unauthenticated State', () => {
    it('redirects to /login if unauthenticated', () => {
      mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
      render(<WishlistPage />);
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  describe('Authenticated State', () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    const mockWishes = [
      { _id: 'w1', text: 'First wish', date: new Date().toISOString() },
      { _id: 'w2', text: 'Second wish', date: new Date().toISOString() },
    ];

    beforeEach(() => {
      mockUseSession.mockReturnValue({ data: { user: mockUser }, status: 'authenticated' });
    });

    it('displays the heading and fetches wishes', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWishes,
      });
      render(<WishlistPage />);
      expect(await screen.findByText('Whisper to the Cosmos')).toBeInTheDocument();
      expect(global.fetch).toHaveBeenCalledWith('/api/wishes', { cache: 'no-store' });
      expect(await screen.findByText('First wish')).toBeInTheDocument();
      expect(await screen.findByText('Second wish')).toBeInTheDocument();
    });

    it('shows an error message if fetching wishes fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Server error',
      });
      render(<WishlistPage />);
      expect(await screen.findByText(/Failed to fetch wishes: Server error/i)).toBeInTheDocument();
    });
    
    it('redirects to /login if fetching wishes returns 401', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      });
      render(<WishlistPage />);
      await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
    });


    describe('Wish Submission', () => {
      it('allows user to type and submit a wish successfully', async () => {
        (global.fetch as jest.Mock)
          .mockResolvedValueOnce({ // Initial GET
            ok: true,
            json: async () => [], 
          })
          .mockResolvedValueOnce({ // POST
            ok: true,
            json: async () => ({ _id: 'w3', text: 'New wish from test', date: new Date().toISOString() }),
          });

        render(<WishlistPage />);
        
        // Wait for initial loading to complete
        await screen.findByText('Whisper to the Cosmos');

        const textarea = screen.getByPlaceholderText('Speak your wish...');
        const submitButton = screen.getByRole('button', { name: /Send to the Stars/i });

        fireEvent.change(textarea, { target: { value: 'New wish from test' } });
        expect(textarea).toHaveValue('New wish from test');

        fireEvent.click(submitButton);

        // Check if fetch was called for POST
        await waitFor(() => 
          expect(global.fetch).toHaveBeenCalledWith('/api/wishes', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ text: 'New wish from test' }),
          }))
        );
        
        // Check if new wish appears
        expect(await screen.findByText('New wish from test')).toBeInTheDocument();
        // Check if textarea is cleared
        expect(textarea).toHaveValue('');
        // Check for success message
        expect(await screen.findByText('Your wish has been sent to the stars! ✨')).toBeInTheDocument();
      });

      it('shows an error message if wish submission fails', async () => {
        (global.fetch as jest.Mock)
          .mockResolvedValueOnce({ // Initial GET
            ok: true,
            json: async () => [],
          })
          .mockResolvedValueOnce({ // POST
            ok: false,
            status: 500,
            text: async () => 'Failed to send',
          });
        
        render(<WishlistPage />);
        await screen.findByText('Whisper to the Cosmos'); // Wait for load

        const textarea = screen.getByPlaceholderText('Speak your wish...');
        const submitButton = screen.getByRole('button', { name: /Send to the Stars/i });

        fireEvent.change(textarea, { target: { value: 'This will fail' } });
        fireEvent.click(submitButton);
        
        expect(await screen.findByText(/Failed to add wish: Failed to send/i)).toBeInTheDocument();
      });
    });
  });
});

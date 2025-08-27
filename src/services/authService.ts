// This is a mock authentication service.
// In a real application, this would make API calls to a backend.

export const authService = {
  login: async (role: string): Promise<{ name: string; role: string }> => {
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return a mock user based on the role
    const user = { name: `${role} User`, role };
    return user;
  }
};

export interface ContactDetails {
  forename: string;
  email: string;
  message: string;
}

const names = ['John', 'Sarah', 'David', 'Emma', 'Michael', 'Priya', 'James', 'Olivia'];

// Creates new contact details each time so every run uses different data.
export function createContact(): ContactDetails {
  const forename = names[Math.floor(Math.random() * names.length)];
  const id = Date.now();

  return {
    forename,
    email: `${forename.toLowerCase()}.${id}@test.com`,
    message: `Test message ${id}`,
  };
}

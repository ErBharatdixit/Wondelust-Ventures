const dns = require('dns').promises;

// List of disposable email domains to block
const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'throwaway.email',
      'mailinator.com', 'trashmail.com', 'yopmail.com', 'fakeinbox.com',
      'temp-mail.org', 'getnada.com', 'maildrop.cc', 'sharklasers.com'
];

// Common typos for popular email domains
const domainSuggestions = {
      'gmail.con': 'gmail.com',
      'gmail.co': 'gmail.com',
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'yahoo.con': 'yahoo.com',
      'yahoo.co': 'yahoo.com',
      'hotmail.con': 'hotmail.com',
      'hotmail.co': 'hotmail.com',
      'outlook.con': 'outlook.com',
      'outlook.co': 'outlook.com'
};

// Validate email format
function isValidEmailFormat(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
}

// Check if domain has MX records (real email server)
async function hasMXRecords(domain) {
      try {
            const addresses = await dns.resolveMx(domain);
            return addresses && addresses.length > 0;
      } catch (error) {
            return false;
      }
}

// Main validation function
module.exports.validateEmail = async (email) => {
      // Basic format check
      if (!isValidEmailFormat(email)) {
            return {
                  valid: false,
                  error: 'Invalid email format'
            };
      }

      const domain = email.split('@')[1].toLowerCase();

      // Check for disposable email
      if (disposableDomains.includes(domain)) {
            return {
                  valid: false,
                  error: 'Disposable email addresses are not allowed. Please use a permanent email address.'
            };
      }

      // Check for common typos
      if (domainSuggestions[domain]) {
            return {
                  valid: false,
                  error: `Did you mean ${email.split('@')[0]}@${domainSuggestions[domain]}?`,
                  suggestion: `${email.split('@')[0]}@${domainSuggestions[domain]}`
            };
      }

      // Check if domain has MX records (optional but recommended)
      const hasValidDomain = await hasMXRecords(domain);
      if (!hasValidDomain) {
            return {
                  valid: false,
                  error: 'Email domain does not exist or cannot receive emails'
            };
      }

      return {
            valid: true
      };
};

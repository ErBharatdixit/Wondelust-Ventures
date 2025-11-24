import { useState } from 'react';

function PasswordStrength({ password }) {
      const [strength, setStrength] = useState({ score: 0, text: '', color: '' });

      const calculateStrength = (pwd) => {
            let score = 0;
            if (!pwd) return { score: 0, text: '', color: '' };

            // Length check
            if (pwd.length >= 8) score += 25;
            if (pwd.length >= 12) score += 15;

            // Character variety
            if (/[a-z]/.test(pwd)) score += 15;
            if (/[A-Z]/.test(pwd)) score += 15;
            if (/[0-9]/.test(pwd)) score += 15;
            if (/[^a-zA-Z0-9]/.test(pwd)) score += 15;

            // Determine text and color
            let text = '';
            let color = '';
            if (score < 30) {
                  text = 'Weak';
                  color = 'bg-red-500';
            } else if (score < 60) {
                  text = 'Fair';
                  color = 'bg-orange-500';
            } else if (score < 80) {
                  text = 'Good';
                  color = 'bg-yellow-500';
            } else {
                  text = 'Strong';
                  color = 'bg-green-500';
            }

            return { score, text, color };
      };

      useState(() => {
            setStrength(calculateStrength(password));
      }, [password]);

      if (!password) return null;

      const currentStrength = calculateStrength(password);

      return (
            <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                    className={`h-full transition-all duration-300 ${currentStrength.color}`}
                                    style={{ width: `${currentStrength.score}%` }}
                              />
                        </div>
                        <span className="text-sm font-medium text-gray-700 min-w-[60px]">
                              {currentStrength.text}
                        </span>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1">
                        <li className={password.length >= 8 ? 'text-green-600' : ''}>
                              {password.length >= 8 ? '✓' : '○'} At least 8 characters
                        </li>
                        <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'text-green-600' : ''}>
                              {/[A-Z]/.test(password) && /[a-z]/.test(password) ? '✓' : '○'} Upper & lowercase letters
                        </li>
                        <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
                              {/[0-9]/.test(password) ? '✓' : '○'} At least one number
                        </li>
                        <li className={/[^a-zA-Z0-9]/.test(password) ? 'text-green-600' : ''}>
                              {/[^a-zA-Z0-9]/.test(password) ? '✓' : '○'} Special character (!@#$%)
                        </li>
                  </ul>
            </div>
      );
}

export default PasswordStrength;

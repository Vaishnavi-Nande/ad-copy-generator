try {
  const lucide = require('lucide-react');
  console.log('Send export exists:', !!lucide.Send);
} catch (e) {
  console.log('Error importing lucide-react with require:', e.message);
  // Try dynamic import
  import('lucide-react').then(m => {
    console.log('Send ESM export exists:', !!m.Send);
  }).catch(err => {
    console.error('ESM import error:', err);
  });
}

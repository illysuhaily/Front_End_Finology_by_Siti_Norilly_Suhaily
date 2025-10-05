# Front_End_Finology_by_Siti_Norilly_Suhaily

## Overview
This project is a **responsive, user-friendly React.js application** that fetches and displays user data from the public API:  
🔗 [https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)

It demonstrates:
- API integration and error handling  
- Real-time search and filtering  
- Clean state management with React Hooks  
- Accessibility and responsive design  
- TypeScript implementation for maintainability and clarity

---
## Features

### API Integration
- Fetches and displays user data (name, email, city, company, phone, website)
- Gracefully handles **loading** and **error** states
- Artificial **3-second delay** added for testing “Loading…” state visibility

### Filtering System
- **Real-time search** by name
- **Filter by city** and **company** using dropdowns
- **Clear all filters** button to reset search and dropdowns
- Filters apply **AND logic** (all active filters must match)

### UI/UX & Accessibility
- Always shows:  
  `Showing X of Y users`
- Displays:
  `⏳ Loading…` during data fetch  
- Displays `ℹ️ No results found`  only when filters hide all users after loading  
- Accessible with proper **ARIA labels** and **screen-reader support**  
- Responsive layout designed for desktop and mobile

---
| Technology | Purpose |
|-------------|----------|
| **React.js** | Front-end framework |
| **TypeScript** | Type safety and cleaner structure |
| **CSS3** | Custom styling for cards, layout, and filters |
| **ES6+** | Modern JavaScript syntax |
| **HTML5** | Semantic markup and accessibility |

---
  

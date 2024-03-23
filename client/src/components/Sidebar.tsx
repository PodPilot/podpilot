import TopicCard from './TopicCard';

const topicsArray = [
  {
    label: 'Intermittent Fasting',
    img: 'https://unsplash.com/photos/an-open-book-with-a-picture-of-a-waterfall-Xk8wUSX9ZiE',
    query: 'What is intermittent fasting about?',
  },

  {
    label: 'Meditation',
    img: 'https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    query: 'What is the most relaxing sleep meditation?',
  },

  {
    label: 'Bio Hacks',
    img: 'https://unsplash.com/photos/brown-and-black-fur-on-white-ceramic-plate-suj3od1uMv8',
    query: 'What is latest bio hack?',
  },

  {
    label: 'Longevity',
    img: 'https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    query: 'How do we live longer?',
  },

  {
    label: 'Mens Health',
    img: 'https://unsplash.com/photos/brown-and-black-fur-on-white-ceramic-plate-suj3od1uMv8',
    query: 'What is latest study on mens health?',
  },
];

export default function Sidebar() {
  return (
    <div className="drawer-side p-4 w-80 min-h-full bg-base-200">
      <label
        htmlFor="my-drawer-2"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      <div className="prose text-center pt-4">
        <h2 className="font-rosarivo">Discover something...</h2>
      </div>

      <div className="divider"></div>

      <div className="grid grid-cols-2 gap-4">
        {topicsArray.map((topic, idx) => (
          <TopicCard
            key={idx}
            label={topic.label}
            query={topic.query}
          />
        ))}
      </div>
    </div>
      <div className="drawer-side p-4 w-80 min-h-full" data-theme="coffee">
        <h1> PodPilot</h1>
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <div className="grid grid-cols-2 gap-4">
          {topicsArray.map(topic => (
            <Card 
              key={topic.title + 1} 
              title={topic.title} 
              img={topic.img} 
              onClick={() => handleCardClick(topic.title)} 
              />
            ))}
        </div> 
      </div>
  );
}

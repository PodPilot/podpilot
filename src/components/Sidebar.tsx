import TopicCard from './TopicCard';

const topicsArray = [
  {
    label: 'Intermittent Fasting',
    img: 'https://images.unsplash.com/photo-1613408324997-fe8106e837e5?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    query: 'What is intermittent fasting about?',
  },

  {
    label: 'Meditation',
    img: 'https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    query: 'What is the most relaxing sleep meditation?',
  },

  {
    label: 'Bio Hacks',
    img: 'https://images.unsplash.com/photo-1617339860632-f53c5b5dce4d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    query: 'What is latest bio hack?',
  },

  {
    label: 'Longevity',
    img: 'https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    query: 'How do we live longer?',
  },

  {
    label: 'Mens Health',
    img: 'https://images.unsplash.com/photo-1617339860632-f53c5b5dce4d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    query: 'What is latest study on mens health?',
  },
];

export default function Sidebar() {
  return (
    <div
      className="drawer-side p-4 w-80 min-h-full hidden sm:block"
      data-theme="coffee"
    >
      <div className="prose text-center pt-4">
        <h2 className="font-rosarivo">Discover something...</h2>
      </div>

      <div className="divider"></div>

      <div className="grid grid-cols-2 gap-4">
        {topicsArray.map((topic, idx) => (
          <TopicCard
            key={idx}
            img={topic.img}
            label={topic.label}
            query={topic.query}
          />
        ))}
      </div>
    </div>
  );
}

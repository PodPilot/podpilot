import Sidebar from './components/Sidebar';
import Content from './components/Content';

export default function App() {
  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle"
      />

      <Sidebar />

      <Content />
    </div>
  );
}

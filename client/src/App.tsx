import Sidebar from './components/Sidebar';
import Content from './components/Content';

export default function App() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      <Sidebar />

      <div className="drawer-content flex flex-col items-center justify-center">
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>
        <Content />
      </div>

    </div>

  );

}

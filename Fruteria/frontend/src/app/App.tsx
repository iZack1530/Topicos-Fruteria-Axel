import { RouterProvider } from 'react-router';
import { router } from './routes';
import { FruteriaProvider } from './stores/FruteriaProvider';

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f3f7ff,_#dfe7f4_45%,_#cfd9ea_100%)] p-0 md:p-6">
      <div className="w-full h-screen overflow-hidden bg-[#F8F9FE] md:h-[calc(100vh-3rem)] md:mx-auto md:max-w-[1200px] md:rounded-[36px] md:border md:border-slate-200 md:shadow-[0_30px_80px_rgba(15,23,42,0.14)]">
        <FruteriaProvider>
          <RouterProvider router={router} />
        </FruteriaProvider>
      </div>
    </div>
  );
}

export default App;

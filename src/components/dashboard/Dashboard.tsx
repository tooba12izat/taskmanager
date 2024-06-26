import React ,{useEffect}from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideMenu from '../SideMenu';
import { useDispatch, useSelector } from 'react-redux';
import { RootState,AppDispatch } from '../../store';
import { fetchUserProfile } from '../../features/userProfile/userProfileSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector((state: RootState) => state.profile);
  const location = useLocation();
  const [menuName, setMenuName] = React.useState<string>('');

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  React.useEffect(() => {
    // Extract menu name from location pathname
    const pathname = location.pathname;
    if (pathname.includes('/dashboard/projects')) {
      setMenuName('projects');
    } else if (pathname.includes('/dashboard/users')) {
      setMenuName('users');
    } else if (pathname.includes('/dashboard/section3')) {
      setMenuName('Section 3');
    }
    else if (pathname.includes('/dashboard/settings')) {
      setMenuName('Settings');
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen">
      <SideMenu />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-200 p-4 flex justify-between items-center">
          <div className="text-lg font-semibold">{menuName}</div>
          <div>{profile?.name}</div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 bg-white min-h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

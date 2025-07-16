import { useContext } from 'react';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from '@/App';

const Header = ({ onMobileMenuClick, title = "Dashboard" }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuClick}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <ApperIcon name="Bell" className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <ApperIcon name="Settings" className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <ApperIcon name="LogOut" className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
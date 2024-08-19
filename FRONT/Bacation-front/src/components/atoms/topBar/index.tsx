import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title: String;
}

export const TopBar = ({ title }: TopBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex space-x-5 py-5 mb-3 px-3">
      <FontAwesomeIcon
        icon={faAngleLeft}
        className="mt-1"
        onClick={() => navigate(-1)}
      />
      <p className="text-lg font-semibold">{title}</p>
    </div>
  );
};

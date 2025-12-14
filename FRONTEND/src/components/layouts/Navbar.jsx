import PrimaryButton from '../UI/PrimaryButton'
import Input from '../UI/Input'
import CustomSelect from '../UI/CustomSelect'
import { Search } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setModalMode, setModalOpen } from '../../store/ui/modalSlice'
import VehicleModal from '../vehicle/VehicleModal'
import TireModal from '../tire/TireModal'
import { useLocation } from 'react-router'

const Navbar = () => {
  const vehicleStatus = [
    {
      label: 'Available',
      value: 'available'
    },
    {
      label: 'In-transit',
      value: 'inTransit'
    },
    {
      label: 'Maintenance',
      value: 'aintenance'
    },
    {
      label: 'Out-service',
      value: 'outService'
    }
  ]

  const dispatch = useDispatch();
  const modalOpen = useSelector((state) => state.modal?.modalOpen);
  const location = useLocation();

  const modalTarget = (() => {
    const p = location.pathname || '';
    if (p.includes('/vehicles')) return 'vehicle';
    if (p.includes('/tires')) return 'tire';
    return 'vehicle';
  })();

  const handleShowModal = () => {
    dispatch(setModalMode('add'));
    dispatch(setModalOpen(true));
  };
  const handleCloseModal = () => dispatch(setModalOpen(false));

  return (
    <>
      <nav className='w-full px-4 md:px-10 py-2 flex flex-col md:items-center gap-y-2 md:flex-row md:justify-between bg-white border border-gray-200 sticky top-[4.77rem] left-0 z-20'>
        <div className='flex flex-col md:flex-row md:items-center gap-2'>
          <Input 
            className="w-full md:min-w-88"
            name="search"
            placeholder="Search..." 
            icon={Search}/>
          <CustomSelect className="w-full md:min-w-52" options={vehicleStatus}/>
        </div>
        <PrimaryButton onClick={handleShowModal} className="" title={modalTarget === 'tire' ? 'Create tire' : 'Create vehicle'} />
      </nav>
      {modalTarget === 'tire' ? (
        <TireModal open={modalOpen} onClose={handleCloseModal} />
      ) : (
        <VehicleModal open={modalOpen} onClose={handleCloseModal} />
      )}
    </>
  )
}

export default Navbar
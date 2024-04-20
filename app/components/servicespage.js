import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

/**
 * Renders a single service item with expandable details. The component changes its
 * appearance based on the dark mode setting and can be clicked to toggle its expanded state.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.service - Contains details about the service such as title and descriptions.
 * @param {boolean} props.isOpen - Boolean indicating if the service details are expanded.
 * @param {Function} props.toggleItem - Function to toggle the expanded state of the service item.
 * @param {boolean} props.isDarkMode - Indicates if the dark mode is enabled.
 * @returns {React.ReactElement} A clickable service item that shows more details on click.
 */

// Single ServiceItem component
const SingleServiceItem = ({ service, isOpen, toggleItem, isDarkMode }) => (
  <div
    className={`px-4 py-2 rounded-md shadow ${isDarkMode ? 'bg-gray-900 hover:bg-blue-300' : 'bg-white hover:bg-purple-200'} transition duration-300 mb-4 cursor-pointer`}
    onClick={toggleItem}
    aria-expanded={isOpen}
  >
    <div className="flex justify-between items-center">
      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{service.title}</div>
      <svg
        className={`h-6 w-6 transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isOpen ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}
        />
      </svg>
    </div>
    {isOpen && (
      <ul className={`list-disc ml-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        {service.descriptions.map((desc, subIndex) => (
          <li key={subIndex}>{desc}</li>
        ))}
      </ul>
    )}
  </div>
);

const ServiceItem = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(Array(9).fill(false));
  const [searchTerm, setSearchTerm] = useState('');
  
  const toggleItem = index => () => {
    const newIsOpen = [...isOpen];
    newIsOpen[index] = !newIsOpen[index];
    setIsOpen(newIsOpen);
  };

    const services = [
    { title: 'General Ultrasound', descriptions: ['Abdomen Ultrasound', 'Liver Elastography', 'Renal (Kidneys & Bladder) Ultrasound', 'Appendix Ultra Sound', 'Male Pelvis Ultrasound', 'Female Pelvis Ultrasound', 'Abdominal Wall Ultrasound', 'Groin Ultrasound', 'Scrotum/Testes Ultrasound', 'Thyroid Ultrasound', 'Neck (salivary glands, lymph nodes)'] },
    { title: 'Pediatric Imaging', descriptions: ['Hip Ultrasound', 'Cranial Ultrasound', 'Spine Ultrasound', 'Pyloric Stenosis Ultrasound', 'Joints For Effusions', 'Abdominal Ultrasound', 'Renal Ultrasound', 'Liver Elastography', 'Appendix Ultrasound', 'Abdominal Wall Ultrasound', 'Inguinal Hernia', 'Scrotal Ultrasound', 'Pelvis Ultrasound', 'Thyroid/Head/Neck Ultrasound'] },
    { title: 'Musculoskeletal (MSK) Exams', descriptions: ['Shoulder (Includes Rotator Cuff)', 'Elbow', 'Wrist (Includes Carpal Tunnel', 'Hand or Finger', 'Hip', 'Knee (Includes Bakers Cyst', 'Ankle', 'Achilles', 'Foot or Toe', 'Plantar Fascia', 'Muscle/Tendon'] },
    { title: 'Breast Imaging', descriptions: ['Complete Breast Screening Evaluation', 'Screening Mammography', 'Diagnostic Mammography', 'Breast Ultrasound'] },
    { title: 'Obstetrical Exams', descriptions: ['1st Trimester Early Obstetrical (Dating)', '2nd Trimester Detailed Ultrasound', '3rd Trimester Biophysical (BBP)', 'Nuchal Translucency Ultrasound'] },
    { title: 'Interventional & Pain Management Exams', descriptions: ['NEW SportVis™ Injections', 'Platelet Rich Plasma Therapy (PRP)', 'Fine Needle Aspirations', 'Thyroid Biopsy', 'Breast Biopsy', 'Cortisone Injection', 'Tenotomy Injection', 'Ultrasound Guided Lavage'] },
    { title: 'Vascular Exams', descriptions: ['Renal Artery Stenosis/ Renal Doppler', 'Liver Doppler Ultrasound', 'Arterial Leg and ABI Ultrasound', 'Carotid Ultrasound', 'Deep Vein Thrombosis (DVT)'] },
    { title: 'Bone Densitometry Exams', descriptions: ['A Bone Density exam can assess whether or not you have osteoporosis and monitor bone loss over a period of time. The new guidelines as set out from the Alberta Medical Association are starting at age 50 and may be ordered every two years.', 'Please note, bone densitometry exams are only offered at our Airdrie and South Trail locations.'] },
    { title: 'X-ray Exams', descriptions: ['X-Rays are the most commonly used diagnostic medical imaging tool available. X-Rays are performed for a variety of reasons to evaluate bones, lungs, or soft tissues within the body.', 'An X-Ray creates a grey-scale image of the body where structures of different densities show up with various levels of brightness. Dense parts of the body (such as bone) appear bright white on an X-Ray. Muscle and organs (commonly referred to as soft tissues)', '*Please note: All of our x-ray exams are walk-in only. There may also be longer than usual wait times during the lunch hour.'] },
  ];

  // Filter services based on search term
  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.descriptions.some(desc => desc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-lg mx-auto my-8">
      <Helmet>
        <title>Medical Imaging Services</title>
        <meta name="description" content="Explore our wide range of medical imaging services including ultrasound, x-ray exams, and specialized diagnostic procedures." />
        <meta name="keywords" content="medical imaging, ultrasound, x-ray, diagnostic services, healthcare" />
      </Helmet>
      <input
  type="text"
  placeholder="Search services..."
  className={`w-full p-2 mb-10 rounded-lg ${isDarkMode ? 'bg-gray-700 border border-gray-600 text-white' : 'bg-white border border-gray-300 text-black'}`}
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

      {filteredServices.map((service, index) => (
        <SingleServiceItem
          key={index}
          service={service}
          isOpen={isOpen[index]}
          toggleItem={toggleItem(index)}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
};

export default ServiceItem;

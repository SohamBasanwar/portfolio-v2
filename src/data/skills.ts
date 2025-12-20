import { FaPython, FaReact, FaHtml5, FaCss3Alt, FaBrain, FaChartLine, FaChartBar, FaLinux, FaGitAlt, FaNetworkWired, FaGlobeAmericas } from 'react-icons/fa';
import { SiCplusplus, SiJavascript, SiPandas } from 'react-icons/si';

export const skills = [
    { name: 'Python', type: 'Core', icon: FaPython },
    { name: 'C++', type: 'Core', icon: SiCplusplus },
    { name: 'React', type: 'Core', icon: FaReact },
    { name: 'JavaScript', type: 'Core', icon: SiJavascript },
    { name: 'HTML5', type: 'Core', icon: FaHtml5 },
    { name: 'CSS', type: 'Core', icon: FaCss3Alt },
    { name: 'NLP Workflows', type: 'AI', icon: FaBrain },
    { name: 'Pandas', type: 'Data', icon: SiPandas },
    { name: 'Time Series', type: 'Data', icon: FaChartLine },
    { name: 'Data Viz', type: 'Data', icon: FaChartBar },
    { name: 'Geospatial', type: 'Data', icon: FaGlobeAmericas },
    { name: 'System Design', type: 'Sys', icon: FaNetworkWired },
    { name: 'Linux', type: 'Sys', icon: FaLinux },
    { name: 'Git', type: 'Sys', icon: FaGitAlt }
];

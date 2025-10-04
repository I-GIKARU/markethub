import {
  IconBrandLinkedin,
  IconMail,
  IconBrandGithub,
  IconPhone,
  IconWorld,
} from "@tabler/icons-react";

const ContactCard = ({ student }) => {
  const { name, email, linkedin, github, phone, website } = student;

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Contact {name}</h3>
      <p className="text-sm text-gray-600 mb-3">Get in touch with this student:</p>

      <div className="space-y-2 text-sm text-blue-600">
        {email && (
          <a href={`mailto:${email}`} className="flex items-center hover:underline">
            <IconMail size={18} className="mr-2" /> {email}
          </a>
        )}
        {phone && (
          <p className="flex items-center text-gray-700">
            <IconPhone size={18} className="mr-2" /> {phone}
          </p>
        )}
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
            <IconBrandLinkedin size={18} className="mr-2" /> LinkedIn
          </a>
        )}
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
            <IconBrandGithub size={18} className="mr-2" /> GitHub
          </a>
        )}
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
            <IconWorld size={18} className="mr-2" /> Website
          </a>
        )}
      </div>
    </div>
  );
};

export default ContactCard;



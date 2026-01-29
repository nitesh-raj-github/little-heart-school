// app/academics/page.tsx
'use client'

import { useState } from 'react'
import { FaBook, FaGraduationCap, FaUsers, FaChalkboardTeacher, FaLaptop, FaChartLine } from 'react-icons/fa'
import { motion } from 'framer-motion'

const curriculum = [
  {
    stage: 'Pre-Primary (LKG - UKG)',
    description: 'Play-based learning with focus on language, numbers, and social skills',
    subjects: ['English', 'Hindi', 'Mathematics', 'Environmental Science', 'Art & Craft', 'Music', 'Physical Education'],
    methodology: 'Montessori-inspired activities with digital learning tools'
  },
  {
    stage: 'Primary (Classes 1-5)',
    description: 'Foundation building with integrated curriculum',
    subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'Art', 'Music', 'Physical Education', 'Moral Science'],
    methodology: 'Activity-based learning with smart class integration'
  },
  {
    stage: 'Middle School (Classes 6-8)',
    description: 'Subject specialization with critical thinking development',
    subjects: ['English', 'Hindi', 'Mathematics', 'Science (Physics, Chemistry, Biology)', 'Social Science', 'Computer Science', 'Sanskrit', 'Art Education', 'Health & Physical Education'],
    methodology: 'Project-based learning with laboratory sessions'
  },
  {
    stage: 'Secondary (Classes 9-10)',
    description: 'Board preparation with career orientation',
    subjects: ['English', 'Hindi/Sanskrit', 'Mathematics', 'Science', 'Social Science', 'Information Technology', 'Health & Physical Education', 'Work Experience', 'Art Education'],
    methodology: 'Specialized coaching for CBSE board exams'
  }
]

const features = [
  {
    icon: <FaChalkboardTeacher />,
    title: 'Smart Classes',
    description: 'Digital classrooms with interactive content for better engagement'
  },
  {
    icon: <FaLaptop />,
    title: 'Computer Lab',
    description: 'Well-equipped lab with latest technology and internet access'
  },
  {
    icon: <FaBook />,
    title: 'Library',
    description: '5000+ books with digital reading section and reference materials'
  },
  {
    icon: <FaChartLine />,
    title: 'Regular Assessments',
    description: 'Continuous evaluation through unit tests, projects, and practicals'
  },
  {
    icon: <FaUsers />,
    title: 'Remedial Classes',
    description: 'Extra help for students needing additional support'
  },
  {
    icon: <FaGraduationCap />,
    title: 'Career Guidance',
    description: 'Counseling for higher studies and career options from Class 8 onwards'
  }
]

export default function AcademicsPage() {
  const [activeStage, setActiveStage] = useState(0)

  return (
    <div className="pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative h-[30vh] bg-gradient-to-r from-primary-navy to-primary-teal mb-12">
        <div className="absolute inset-0 bg-black/40">
          <div className="container-custom h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Academics</h1>
              <p className="text-xl">Excellence in Education, CBSE Affiliated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-12">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Curriculum Overview</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Following CBSE guidelines with innovative teaching methodologies to ensure holistic development
            </p>
          </div>

          {/* Stage Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {curriculum.map((stage, index) => (
              <button
                key={index}
                onClick={() => setActiveStage(index)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeStage === index
                    ? 'bg-primary-red text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {stage.stage}
              </button>
            ))}
          </div>

          {/* Stage Details */}
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-primary-navy mb-2">
                {curriculum[activeStage].stage}
              </h3>
              <p className="text-gray-600">{curriculum[activeStage].description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold mb-4 text-gray-800">Subjects</h4>
                <div className="space-y-2">
                  {curriculum[activeStage].subjects.map((subject, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                      <span className="text-gray-700">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4 text-gray-800">Teaching Methodology</h4>
                <p className="text-gray-600 mb-4">{curriculum[activeStage].methodology}</p>
                
                <div className="mt-6">
                  <h5 className="font-bold text-gray-800 mb-2">Key Focus Areas:</h5>
                  <ul className="space-y-1">
                    <li className="text-gray-600">• Conceptual understanding</li>
                    <li className="text-gray-600">• Practical applications</li>
                    <li className="text-gray-600">• Critical thinking skills</li>
                    <li className="text-gray-600">• Communication skills</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Academic Features */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Academic Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive approach ensures all-round development of every student
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg card-hover"
              >
                <div className="text-3xl text-primary-red mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Pattern */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Assessment Pattern</h2>
            <p className="text-gray-600">Continuous and Comprehensive Evaluation (CCE) as per CBSE</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Formative Assessment',
                description: 'Ongoing evaluation through classwork, homework, projects, and quizzes',
                percentage: '40%'
              },
              {
                title: 'Summative Assessment',
                description: 'Term-end examinations to assess cumulative learning',
                percentage: '60%'
              },
              {
                title: 'Practical/Internal',
                description: 'Lab work, projects, and internal assessments for comprehensive evaluation',
                percentage: 'Varies by Subject'
              }
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-primary-navy to-primary-teal text-white rounded-2xl p-8">
                <div className="text-4xl font-bold mb-2">{item.percentage}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/90">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-primary-red text-white">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Academic Excellence</h2>
            <p className="text-white/80">Our students consistently excel in CBSE examinations</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { value: '100%', label: 'Board Result 2023' },
              { value: '96.4%', label: 'Highest Score 2023' },
              { value: '85%', label: 'Above 90% Score' },
              { value: '12', label: 'School Toppers' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
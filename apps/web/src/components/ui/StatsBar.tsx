'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '7+', label: 'Products Shipped' },
  { value: '5', label: 'Awards Won' },
  { value: '8.62', label: 'CGPA (B.Tech)' },
  { value: '10+', label: 'Technologies' },
];

export default function StatsBar() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass rounded-2xl px-6 py-5 grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x divide-slate-800 gap-y-5 md:gap-y-0"
      >
        {stats.map((stat, i) => (
          <div key={stat.label} className="text-center px-4">
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              className="text-3xl font-bold gradient-text mb-1"
            >
              {stat.value}
            </motion.p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

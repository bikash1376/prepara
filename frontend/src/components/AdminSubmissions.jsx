import { motion } from "framer-motion";
const AdminSubmissions = () => {
    return (
        <div>
            <motion.div className="flex items-center justify-center h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 5 }}>
                <p className="text-4xl">Coming soon</p>
            </motion.div>
        </div>
    );  
};

export default AdminSubmissions;
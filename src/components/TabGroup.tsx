import React from "react";
import styles from "./styles/TabGroup.module.css";

interface TabGroupProps {
    tabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabGroup: React.FC<TabGroupProps> = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className={styles.tabList}>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={
                        tab === activeTab ? `${styles.tab} ${styles.active}` : styles.tab
                    }
                    onClick={() => setActiveTab(tab)}
                    type="button"
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default TabGroup;

import styles from './Footer.module.css';
function Container({children}) {
    return (
      <main className={styles.container}>{children}</main>

    )
}
export default Container
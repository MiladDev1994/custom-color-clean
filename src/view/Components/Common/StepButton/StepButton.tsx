import React from 'react'
import styles from "./StepButton.module.scss"
import Button from '../Button/Button';

function StepButton({title, onClick, description}: any) {
  return (
    <div className={styles.stepContainer}>
        <div className={styles.stepBox}>
            <div>
                {description && <h3> {description} </h3>}
                <h1> {title} </h1>
                
            </div>
            <Button
                color='gray'
                fill='outline'
                outLineSize='1px'
                outlineColor='lightgray'
                expand='full'
                icon='chevron-double-right'
                iconWidth="1.5rem"
                iconHeight="1.5rem"
                direction='row_reverse'
                onClick={() => onClick("plus")}
                classNames={{
                    container: styles.btn
                }}
            />
            <Button
                color='gray'
                fill='outline'
                outLineSize='1px'
                outlineColor='lightgray'
                expand='full'
                icon='chevron-double-left'
                iconWidth="1.5rem"
                iconHeight="1.5rem"
                direction='row_reverse'
                onClick={() => onClick("minus")}
                classNames={{
                    container: styles.btn
                }}
            />
        </div>
    </div>
  )
}


export default StepButton;
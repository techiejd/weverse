import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import {useForm} from 'react-hook-form'
import {useRouter} from 'next/router'

 
const OnboardingForm: NextPage = () => {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const router=useRouter();
    const onSubmit = async(data: any) => {
        router.push('/succesForm')
    }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
            Bienvenido al WeVerse
        </h1>

        <p className={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>👺:</h2>
                <textarea placeholder="Escribe tu mentira..." className={styles.textInput} {...register("Mentira", {required:"*"})} />
                <br/>
                <br/>
                <hr/>
                <h2>📷:</h2>
                <textarea placeholder="Escribe tu primera verdad..." className={styles.textInput} {...register("PrimeraVerdad", {required:"*"})} />
                <h3>Selecciona las validaciones de tu verdad 🌟</h3>
                <label htmlFor="file-upload" className={styles.labelInput}>
                    Elegir tus archivos de la verdad
                </label>
                <input className={styles.hiddenInput} id="file-upload" placeholder="Elegir todos los archivos de tu verdad" type="file" multiple {...register("Files",{required:"*"})}/>
                <br/>
                <br/>
                <hr/>
                <h2>📷:</h2>
                <textarea placeholder="Escribe tu segunda verdad..." className={styles.textInput} {...register("SegundaVerdad", {required:"*"})} />
                <br/>
                <br/>
                <hr/>
                <button className={styles.button}>Terminar</button>
            </form>
          </div>
      </main>
    </div>
  )
}

export default OnboardingForm

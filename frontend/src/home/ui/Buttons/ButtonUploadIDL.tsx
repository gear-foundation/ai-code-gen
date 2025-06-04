import { 
    useRef,
} from "react";
import { Button } from "@gear-js/vara-ui";
import { useAlert } from "@gear-js/react-hooks";
import clsx from "clsx";
import styles from "../../styles/Buttons/button.module.scss";

interface Props {
    onIDLFileSubmit: (fileContent: string, fileName: string) => void;
    disableButton?: boolean;
}

export const ButtonUploadIDL = ({ onIDLFileSubmit, disableButton }: Props) => {
    const alert = useAlert();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (!inputRef.current) return;

        inputRef.current.click();
    }

    const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        const file = files
            ? files[0]
            : null;

        if (!file) return;

        if (!file.name.endsWith('.idl')) {
            console.warn('Invalid file extension');
            console.error('Invalid file extension')
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const content = reader.result as string;
            const fileName = file.name; 
            onIDLFileSubmit(content, fileName);
        };

        reader.onerror = () => {
            console.error('Error while reading file content');
        };

        reader.readAsText(file);
    };

    return (
        <>
            <Button 
                text="Upload IDL" 
                color="contrast"
                isLoading={disableButton}
                className={
                    clsx(
                        styles.button
                    )
                }
                onClick={handleClick}
            />
            <input
                type="file"
                accept=".idl"
                style={{ display: 'none' }}
                ref={inputRef}
                onChange={handleSelectedFile}
            />
        </>
    );
}

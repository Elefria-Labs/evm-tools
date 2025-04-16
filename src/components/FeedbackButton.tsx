import { useEffect, useState } from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { ToastAction } from '@shadcn-components/ui/toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@shadcn-components/ui/alert-dialog';
import { Button } from '@shadcn-components/ui/button';
import { Textarea } from '@shadcn-components/ui/textarea';
import { supabase } from '@utils/AppConfig';

const userRating = {
  1: '😕',
  2: '😐',
  3: '😀',
};

export default function FeedbackButton({
  buttonText = 'Feedback',
  feedbackLabel = 'Tell us how we are doing?',
  submitButtonLabel = 'Submit',
  successMessage = 'Thank you for your feedback! Follow us on X @evmtools_xyz',
  isFloating = true,
}) {
  const [feedbackText, setFeedbackText] = useState<string>();
  const [rating, setRating] = useState<number>();

  const { toast } = useToast();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <></>;
  }

  const handleSubmit = async () => {
    if (!feedbackText || feedbackText.trim().length < 3) {
      return;
    }
    const { error } = await supabase
      .from('user-feedback')
      .insert([{ feedback_text: feedbackText, rating: rating }]);
    if (error) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    toast({
      title: successMessage,
      variant: 'default',
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackText(event.target.value);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {isFloating ? (
          <Button
            className="bottom-4 right-4 fixed"
            // position="fixed"
          >
            {buttonText}
          </Button>
        ) : (
          <p>{buttonText}</p>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{feedbackLabel}</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-row justify-center mb-2">
              {Object.values(userRating).map((r, i) => (
                <p
                  className={`text-4xl mr-4 hover:bg-gray-700 ${
                    rating == i + 1 ? 'bg-gray-700' : ''
                  } rounded-md cursor-pointer`}
                  key={i}
                  onClick={() => {
                    setRating(i + 1);
                  }}
                >
                  {r}
                </p>
              ))}
            </div>
            <Textarea
              value={feedbackText}
              placeholder="We will fix or build what you want, just ask :)"
              onChange={handleInputChange}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            {submitButtonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

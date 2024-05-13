import { useState } from 'react';
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

import { createClient } from '@supabase/supabase-js';
import { Textarea } from '@shadcn-components/ui/textarea';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SBASE_URL!,
  process.env.NEXT_PUBLIC_SBASE_ANON_KEY!,
);

const userRating = {
  1: '😕',
  2: '😐',
  3: '😀',
};
interface FeedbackButtonProps {
  // Optional custom text to display on the button
  buttonText?: string;
  // Optional custom text to display in the feedback modal
  feedbackLabel?: string;
  // Optional custom text to display in the submit button
  submitButtonLabel?: string;
  // Optional custom text to display in the success toast message
  successMessage?: string;
  // Optional custom text to display in the error toast message
  errorMessage?: string;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  buttonText = 'Feedback',
  feedbackLabel = 'Tell us how we are doing?',
  submitButtonLabel = 'Submit',
  // successMessage = 'Thanks for your feedback!',
  // errorMessage = 'Oops, something went wrong. Please try again later.',
}) => {
  const [feedbackText, setFeedbackText] = useState<string>();
  const [rating, setRating] = useState<number>();

  const { toast } = useToast();

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
      title: 'Thank you for your feedback.',
      variant: 'default',
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackText(event.target.value);
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button
            className="bottom-4 right-4 fixed"
            // position="fixed"
          >
            {buttonText}
          </Button>
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
    </>
  );
};

export default FeedbackButton;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.collabpaint;

import edu.eci.arsw.collabpaint.model.Point;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 *
 * @author Gabriel
 */
@Controller
public class STOMPMessagesHandler {
    
    @Autowired
    SimpMessagingTemplate msgt;
    ConcurrentHashMap<String, ArrayList<Point>> poliginos=new ConcurrentHashMap<>();
    
    @MessageMapping("/newpoint.{numdibujo}")
    public void handlePointEvent(Point pt, @DestinationVariable String numdibujo){
        if (poliginos.containsKey(numdibujo)) {
            poliginos.get(numdibujo).add(pt);
            if (poliginos.get(numdibujo).size()>3) {
                msgt.convertAndSend("/topic/newpolygon."+numdibujo,poliginos.get(numdibujo));
            }else{
                ArrayList lista =new ArrayList<>();
                lista.add(pt);
                poliginos.put(numdibujo, lista);
            }
        }
    }
}
